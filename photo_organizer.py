#!/usr/bin/env python3
"""
📸 Photo Organizer - 위치 기반 사진 정리기
날짜+위치 분류, 중복 제거, 사진 미리보기 기능
"""

import os
import sys
import shutil
import hashlib
import struct
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageTk
import threading
import json
import math
from collections import defaultdict

# ── 색상 테마 ──────────────────────────────────────────────
COLORS = {
    "bg":        "#0F0F13",
    "card":      "#1A1A24",
    "card2":     "#22222E",
    "border":    "#2E2E40",
    "accent":    "#6C63FF",
    "accent2":   "#FF6B9D",
    "success":   "#4ECDC4",
    "warn":      "#FFD93D",
    "text":      "#E8E8F0",
    "text2":     "#8888AA",
    "text3":     "#555570",
}

# ── EXIF GPS 추출 ──────────────────────────────────────────
def get_exif_data(image_path):
    """PIL을 사용해 EXIF 데이터 추출"""
    try:
        img = Image.open(image_path)
        exif_data = img._getexif()
        return exif_data or {}
    except Exception:
        return {}

def dms_to_dd(dms, ref):
    """도분초(DMS) → 십진수(DD) 변환"""
    try:
        deg, min_, sec = dms
        # Pillow는 튜플로 반환
        if hasattr(deg, 'numerator'):
            deg  = deg.numerator  / deg.denominator
            min_ = min_.numerator / min_.denominator
            sec  = sec.numerator  / sec.denominator
        dd = float(deg) + float(min_)/60 + float(sec)/3600
        if ref in ['S', 'W']:
            dd = -dd
        return dd
    except Exception:
        return None

def get_gps_from_exif(exif):
    """EXIF dict에서 위도/경도 추출"""
    GPS_TAG = 34853  # GPSInfo IFD
    if GPS_TAG not in exif:
        return None, None
    gps = exif[GPS_TAG]
    try:
        lat = dms_to_dd(gps.get(2), gps.get(1, 'N'))
        lon = dms_to_dd(gps.get(4), gps.get(3, 'E'))
        return lat, lon
    except Exception:
        return None, None

def get_date_from_exif(exif):
    """EXIF에서 촬영일 추출"""
    for tag in [36867, 36868, 306]:  # DateTimeOriginal, DateTimeDigitized, DateTime
        if tag in exif:
            try:
                dt = datetime.strptime(exif[tag], "%Y:%m:%d %H:%M:%S")
                return dt
            except Exception:
                pass
    return None

def get_image_hash(image_path):
    """SHA256 해시로 중복 탐지"""
    h = hashlib.sha256()
    with open(image_path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

# ── 좌표 → 지역명 (오프라인 역지오코딩) ──────────────────────
# 주요 도시 좌표 DB (오프라인)
CITY_DB = [
    # 한국
    (37.5665, 126.9780, "한국", "서울"),
    (35.1796, 129.0756, "한국", "부산"),
    (35.8714, 128.6014, "한국", "대구"),
    (37.4563, 126.7052, "한국", "인천"),
    (35.1595, 126.8526, "한국", "광주"),
    (36.3504, 127.3845, "한국", "대전"),
    (35.5384, 129.3114, "한국", "울산"),
    (36.4800, 127.2890, "한국", "세종"),
    (37.2636, 127.0286, "한국", "수원"),
    (33.4890, 126.4983, "한국", "제주"),
    (37.8813, 127.7300, "한국", "춘천"),
    (36.0190, 129.3435, "한국", "포항"),
    (35.8242, 127.1480, "한국", "전주"),
    # 일본
    (35.6762, 139.6503, "일본", "도쿄"),
    (34.6937, 135.5023, "일본", "오사카"),
    (35.0116, 135.7681, "일본", "교토"),
    (43.0618, 141.3545, "일본", "삿포로"),
    (26.2124, 127.6809, "일본", "오키나와"),
    # 중국
    (39.9042, 116.4074, "중국", "베이징"),
    (31.2304, 121.4737, "중국", "상하이"),
    # 동남아
    (13.7563, 100.5018, "태국", "방콕"),
    (14.0583, 108.2772, "베트남", "다낭"),
    (10.8231, 106.6297, "베트남", "호치민"),
    (21.0285, 105.8542, "베트남", "하노이"),
    (3.1390, 101.6869, "말레이시아", "쿠알라룸푸르"),
    (1.3521, 103.8198, "싱가포르", "싱가포르"),
    (22.3193, 114.1694, "홍콩", "홍콩"),
    (25.0330, 121.5654, "대만", "타이베이"),
    # 유럽
    (48.8566, 2.3522, "프랑스", "파리"),
    (51.5074, -0.1278, "영국", "런던"),
    (52.5200, 13.4050, "독일", "베를린"),
    (41.9028, 12.4964, "이탈리아", "로마"),
    (40.4168, -3.7038, "스페인", "마드리드"),
    (41.3851, 2.1734, "스페인", "바르셀로나"),
    (48.2082, 16.3738, "오스트리아", "빈"),
    (50.0755, 14.4378, "체코", "프라하"),
    (47.4979, 19.0402, "헝가리", "부다페스트"),
    # 미주
    (40.7128, -74.0060, "미국", "뉴욕"),
    (34.0522, -118.2437, "미국", "로스앤젤레스"),
    (41.8781, -87.6298, "미국", "시카고"),
    (37.7749, -122.4194, "미국", "샌프란시스코"),
    (21.3069, -157.8583, "미국", "호놀룰루"),
    (-33.8688, 151.2093, "호주", "시드니"),
]

def haversine(lat1, lon1, lat2, lon2):
    """두 좌표 간 거리(km) 계산"""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def coords_to_location(lat, lon):
    """좌표 → 도시명 (오프라인 DB 사용)"""
    best_dist = float('inf')
    best_country, best_city = "해외", f"{lat:.1f}_{lon:.1f}"
    for city_lat, city_lon, country, city in CITY_DB:
        dist = haversine(lat, lon, city_lat, city_lon)
        if dist < best_dist:
            best_dist = dist
            best_country, best_city = country, city
    # 50km 이내면 해당 도시, 아니면 좌표 기반
    if best_dist <= 50:
        return best_country, best_city
    # 나라 범위로 추정
    if 33 <= lat <= 43 and 124 <= lon <= 132:
        return "한국", f"미상_{lat:.0f}N{lon:.0f}E"
    if 30 <= lat <= 46 and 130 <= lon <= 146:
        return "일본", f"미상_{lat:.0f}N{lon:.0f}E"
    return "해외", f"{lat:.0f}N{lon:.0f}E"

# ── DBSCAN 클러스터링 ──────────────────────────────────────
def cluster_by_location(photos, eps_km=2.0):
    """위치 기반 DBSCAN 클러스터링 (sklearn)"""
    coords_rad = []
    for p in photos:
        if p['lat'] and p['lon']:
            coords_rad.append([math.radians(p['lat']), math.radians(p['lon'])])
        else:
            coords_rad.append(None)

    # GPS 있는 사진만 클러스터링
    valid = [(i, c) for i, c in enumerate(coords_rad) if c is not None]
    if not valid:
        return {i: -1 for i in range(len(photos))}

    import numpy as np
    from sklearn.cluster import DBSCAN

    indices = [i for i, _ in valid]
    coords  = np.array([c for _, c in valid])
    eps_rad = eps_km / 6371.0

    labels = DBSCAN(eps=eps_rad, min_samples=1, metric='haversine').fit_predict(coords)
    result = {i: -1 for i in range(len(photos))}
    for idx, label in zip(indices, labels):
        result[idx] = int(label)
    return result

# ── 메인 앱 ───────────────────────────────────────────────
class PhotoOrganizerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("📸 Photo Organizer")
        self.root.geometry("1100x750")
        self.root.configure(bg=COLORS["bg"])
        self.root.resizable(True, True)

        self.source_dir = tk.StringVar()
        self.output_dir = tk.StringVar()
        self.photos = []
        self.duplicates = []
        self.selected_photo = None
        self.preview_images = {}  # cache
        self._stop_scan = False

        self._build_ui()

    # ── UI 구성 ────────────────────────────────────────────
    def _build_ui(self):
        # 전체 레이아웃
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(1, weight=1)

        self._build_header()
        self._build_main()
        self._build_statusbar()

    def _build_header(self):
        hdr = tk.Frame(self.root, bg=COLORS["card"], pady=0)
        hdr.grid(row=0, column=0, sticky="ew")

        tk.Label(hdr, text="📸  Photo Organizer",
                 font=("Helvetica", 18, "bold"),
                 bg=COLORS["card"], fg=COLORS["accent"]).pack(side="left", padx=24, pady=14)

        tk.Label(hdr, text="위치 기반 자동 사진 정리기",
                 font=("Helvetica", 10),
                 bg=COLORS["card"], fg=COLORS["text2"]).pack(side="left", padx=4)

        # 헤더 우측 버튼
        btn_frame = tk.Frame(hdr, bg=COLORS["card"])
        btn_frame.pack(side="right", padx=16)

        self._hbtn(btn_frame, "⚙  설정", self._show_settings).pack(side="right", padx=4)

    def _build_main(self):
        main = tk.Frame(self.root, bg=COLORS["bg"])
        main.grid(row=1, column=0, sticky="nsew", padx=16, pady=12)
        main.grid_columnconfigure(1, weight=1)
        main.grid_rowconfigure(0, weight=1)

        self._build_sidebar(main)
        self._build_content(main)

    def _build_sidebar(self, parent):
        sb = tk.Frame(parent, bg=COLORS["card"], width=280)
        sb.grid(row=0, column=0, sticky="ns", padx=(0, 12), pady=0)
        sb.grid_propagate(False)

        # 폴더 선택 섹션
        sec = self._section(sb, "📁  폴더 설정")
        sec.pack(fill="x", padx=12, pady=(16, 8))

        tk.Label(sec, text="원본 폴더", font=("Helvetica", 9),
                 bg=COLORS["card"], fg=COLORS["text2"]).pack(anchor="w")
        row1 = tk.Frame(sec, bg=COLORS["card"])
        row1.pack(fill="x", pady=(2, 8))
        self._entry(row1, self.source_dir).pack(side="left", fill="x", expand=True)
        self._btn(row1, "찾기", lambda: self._browse(self.source_dir)).pack(side="right", padx=(4,0))

        tk.Label(sec, text="저장 폴더", font=("Helvetica", 9),
                 bg=COLORS["card"], fg=COLORS["text2"]).pack(anchor="w")
        row2 = tk.Frame(sec, bg=COLORS["card"])
        row2.pack(fill="x", pady=(2, 0))
        self._entry(row2, self.output_dir).pack(side="left", fill="x", expand=True)
        self._btn(row2, "찾기", lambda: self._browse(self.output_dir)).pack(side="right", padx=(4,0))

        ttk.Separator(sb, orient="horizontal").pack(fill="x", padx=12, pady=12)

        # 옵션
        sec2 = self._section(sb, "⚙  옵션")
        sec2.pack(fill="x", padx=12, pady=(0, 8))

        self.opt_date    = tk.BooleanVar(value=True)
        self.opt_loc     = tk.BooleanVar(value=True)
        self.opt_dup     = tk.BooleanVar(value=True)
        self.opt_move    = tk.BooleanVar(value=False)
        self.opt_preview = tk.BooleanVar(value=True)

        self._checkbox(sec2, "날짜별 분류", self.opt_date)
        self._checkbox(sec2, "위치별 분류", self.opt_loc)
        self._checkbox(sec2, "중복 사진 제거", self.opt_dup)
        self._checkbox(sec2, "복사 대신 이동", self.opt_move)

        ttk.Separator(sb, orient="horizontal").pack(fill="x", padx=12, pady=12)

        # 실행 버튼
        self._big_btn(sb, "🔍  스캔 시작", self._start_scan, COLORS["accent"]).pack(
            fill="x", padx=12, pady=(0, 8))
        self._big_btn(sb, "🗂  정리 실행", self._start_organize, COLORS["success"]).pack(
            fill="x", padx=12, pady=(0, 8))

        # 통계
        ttk.Separator(sb, orient="horizontal").pack(fill="x", padx=12, pady=8)
        self.stat_frame = tk.Frame(sb, bg=COLORS["card"])
        self.stat_frame.pack(fill="x", padx=12, pady=(0, 12))

        self.stat_total   = self._stat_row(self.stat_frame, "전체 사진", "0")
        self.stat_gps     = self._stat_row(self.stat_frame, "GPS 있음", "0")
        self.stat_dup     = self._stat_row(self.stat_frame, "중복 발견", "0")
        self.stat_groups  = self._stat_row(self.stat_frame, "위치 그룹", "0")

    def _build_content(self, parent):
        content = tk.Frame(parent, bg=COLORS["bg"])
        content.grid(row=0, column=1, sticky="nsew")
        content.grid_columnconfigure(0, weight=1)
        content.grid_rowconfigure(1, weight=1)

        # 탭
        tab_frame = tk.Frame(content, bg=COLORS["bg"])
        tab_frame.grid(row=0, column=0, sticky="ew", pady=(0, 8))

        self.active_tab = tk.StringVar(value="photos")
        tabs = [("📷 사진 목록", "photos"), ("🗺 위치 그룹", "groups"), ("🔁 중복 사진", "dups")]
        self.tab_btns = {}
        for label, key in tabs:
            b = tk.Button(tab_frame, text=label,
                          font=("Helvetica", 10),
                          bd=0, padx=16, pady=8, cursor="hand2",
                          command=lambda k=key: self._switch_tab(k))
            b.pack(side="left", padx=(0, 4))
            self.tab_btns[key] = b
        self._update_tab_styles()

        # 탭 콘텐츠
        self.tab_container = tk.Frame(content, bg=COLORS["bg"])
        self.tab_container.grid(row=1, column=0, sticky="nsew")
        self.tab_container.grid_columnconfigure(0, weight=1)
        self.tab_container.grid_rowconfigure(0, weight=1)

        self._build_photos_tab()
        self._build_groups_tab()
        self._build_dups_tab()

        self._switch_tab("photos")

    def _build_photos_tab(self):
        frame = tk.Frame(self.tab_container, bg=COLORS["bg"])
        self.tab_frames = {"photos": frame}
        frame.grid(row=0, column=0, sticky="nsew")
        frame.grid_columnconfigure(0, weight=2)
        frame.grid_columnconfigure(1, weight=1)
        frame.grid_rowconfigure(0, weight=1)

        # 좌: 파일 리스트
        list_frame = tk.Frame(frame, bg=COLORS["card"], bd=0)
        list_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 8))
        list_frame.grid_rowconfigure(1, weight=1)
        list_frame.grid_columnconfigure(0, weight=1)

        tk.Label(list_frame, text="사진 목록", font=("Helvetica", 10, "bold"),
                 bg=COLORS["card"], fg=COLORS["text"]).grid(row=0, column=0, sticky="w", padx=12, pady=8)

        cols = ("파일명", "날짜", "위치", "크기")
        self.photo_tree = ttk.Treeview(list_frame, columns=cols, show="headings", height=20)
        self.photo_tree.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))
        for c, w in zip(cols, [200, 120, 150, 80]):
            self.photo_tree.heading(c, text=c)
            self.photo_tree.column(c, width=w, minwidth=50)

        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.photo_tree.yview)
        scrollbar.grid(row=1, column=1, sticky="ns", pady=(0, 8))
        self.photo_tree.configure(yscrollcommand=scrollbar.set)
        self.photo_tree.bind("<<TreeviewSelect>>", self._on_photo_select)

        # 우: 미리보기
        prev_frame = tk.Frame(frame, bg=COLORS["card"])
        prev_frame.grid(row=0, column=1, sticky="nsew")
        prev_frame.grid_rowconfigure(1, weight=1)

        tk.Label(prev_frame, text="미리보기", font=("Helvetica", 10, "bold"),
                 bg=COLORS["card"], fg=COLORS["text"]).grid(row=0, column=0, sticky="w", padx=12, pady=8)

        self.preview_label = tk.Label(prev_frame, bg=COLORS["card2"],
                                      text="사진을 선택하세요", fg=COLORS["text3"],
                                      font=("Helvetica", 10))
        self.preview_label.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))

        self.info_label = tk.Label(prev_frame, bg=COLORS["card"], fg=COLORS["text2"],
                                   font=("Helvetica", 8), justify="left", wraplength=250)
        self.info_label.grid(row=2, column=0, sticky="ew", padx=12, pady=(0, 12))

    def _build_groups_tab(self):
        frame = tk.Frame(self.tab_container, bg=COLORS["bg"])
        self.tab_frames["groups"] = frame
        frame.grid(row=0, column=0, sticky="nsew")
        frame.grid_columnconfigure(0, weight=1)
        frame.grid_rowconfigure(0, weight=1)

        cols = ("위치 그룹", "국가", "도시", "사진 수", "날짜 범위")
        self.groups_tree = ttk.Treeview(frame, columns=cols, show="headings")
        self.groups_tree.grid(row=0, column=0, sticky="nsew", padx=8, pady=8)
        for c, w in zip(cols, [200, 80, 100, 60, 180]):
            self.groups_tree.heading(c, text=c)
            self.groups_tree.column(c, width=w)

        sb = ttk.Scrollbar(frame, orient="vertical", command=self.groups_tree.yview)
        sb.grid(row=0, column=1, sticky="ns", pady=8)
        self.groups_tree.configure(yscrollcommand=sb.set)

    def _build_dups_tab(self):
        frame = tk.Frame(self.tab_container, bg=COLORS["bg"])
        self.tab_frames["dups"] = frame
        frame.grid(row=0, column=0, sticky="nsew")
        frame.grid_columnconfigure(0, weight=1)
        frame.grid_rowconfigure(1, weight=1)

        top = tk.Frame(frame, bg=COLORS["bg"])
        top.grid(row=0, column=0, sticky="ew", pady=(0, 8), padx=8)
        tk.Label(top, text="🔁 중복 사진 목록 - 같은 내용의 사진을 탐지합니다",
                 bg=COLORS["bg"], fg=COLORS["text2"], font=("Helvetica", 9)).pack(side="left")
        self._btn(top, "선택 항목 제거", self._remove_selected_dups).pack(side="right")

        cols = ("원본", "중복 파일", "크기", "날짜")
        self.dups_tree = ttk.Treeview(frame, columns=cols, show="headings")
        self.dups_tree.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))
        for c, w in zip(cols, [250, 250, 80, 120]):
            self.dups_tree.heading(c, text=c)
            self.dups_tree.column(c, width=w)

        sb = ttk.Scrollbar(frame, orient="vertical", command=self.dups_tree.yview)
        sb.grid(row=1, column=1, sticky="ns", pady=(0, 8))
        self.dups_tree.configure(yscrollcommand=sb.set)

    def _build_statusbar(self):
        sb = tk.Frame(self.root, bg=COLORS["card"], height=40)
        sb.grid(row=2, column=0, sticky="ew")

        self.status_var = tk.StringVar(value="준비 완료 - 원본 폴더를 선택하고 스캔을 시작하세요")
        tk.Label(sb, textvariable=self.status_var,
                 bg=COLORS["card"], fg=COLORS["text2"],
                 font=("Helvetica", 9)).pack(side="left", padx=16, pady=8)

        self.progress = ttk.Progressbar(sb, length=200, mode="determinate")
        self.progress.pack(side="right", padx=16, pady=8)

    # ── 위젯 헬퍼 ─────────────────────────────────────────
    def _entry(self, parent, var):
        e = tk.Entry(parent, textvariable=var, font=("Helvetica", 9),
                     bg=COLORS["card2"], fg=COLORS["text"], insertbackground=COLORS["text"],
                     relief="flat", bd=4)
        return e

    def _btn(self, parent, text, cmd):
        return tk.Button(parent, text=text, command=cmd, font=("Helvetica", 9),
                         bg=COLORS["card2"], fg=COLORS["text"], relief="flat",
                         padx=10, pady=4, cursor="hand2",
                         activebackground=COLORS["border"], activeforeground=COLORS["text"])

    def _hbtn(self, parent, text, cmd):
        return tk.Button(parent, text=text, command=cmd, font=("Helvetica", 9),
                         bg=COLORS["card"], fg=COLORS["text2"], relief="flat",
                         padx=10, pady=6, cursor="hand2",
                         activebackground=COLORS["card2"], activeforeground=COLORS["text"])

    def _big_btn(self, parent, text, cmd, color=None):
        c = color or COLORS["accent"]
        return tk.Button(parent, text=text, command=cmd,
                         font=("Helvetica", 11, "bold"),
                         bg=c, fg="white", relief="flat",
                         pady=10, cursor="hand2",
                         activebackground=COLORS["border"], activeforeground="white")

    def _checkbox(self, parent, text, var):
        tk.Checkbutton(parent, text=text, variable=var,
                       bg=COLORS["card"], fg=COLORS["text"],
                       selectcolor=COLORS["card2"],
                       activebackground=COLORS["card"],
                       font=("Helvetica", 9)).pack(anchor="w", pady=2)

    def _section(self, parent, title):
        f = tk.Frame(parent, bg=COLORS["card"])
        tk.Label(f, text=title, font=("Helvetica", 10, "bold"),
                 bg=COLORS["card"], fg=COLORS["text"]).pack(anchor="w", pady=(0, 6))
        return f

    def _stat_row(self, parent, label, value):
        f = tk.Frame(parent, bg=COLORS["card"])
        f.pack(fill="x", pady=2)
        tk.Label(f, text=label, font=("Helvetica", 9),
                 bg=COLORS["card"], fg=COLORS["text2"]).pack(side="left")
        v = tk.StringVar(value=value)
        tk.Label(f, textvariable=v, font=("Helvetica", 9, "bold"),
                 bg=COLORS["card"], fg=COLORS["accent"]).pack(side="right")
        return v

    def _switch_tab(self, key):
        for k, f in self.tab_frames.items():
            if k == key:
                f.lift()
        self.active_tab.set(key)
        self._update_tab_styles()

    def _update_tab_styles(self):
        active = self.active_tab.get()
        for k, b in self.tab_btns.items():
            if k == active:
                b.configure(bg=COLORS["accent"], fg="white")
            else:
                b.configure(bg=COLORS["card"], fg=COLORS["text2"])

    # ── 이벤트 ────────────────────────────────────────────
    def _browse(self, var):
        d = filedialog.askdirectory()
        if d:
            var.set(d)

    def _on_photo_select(self, event):
        sel = self.photo_tree.selection()
        if not sel:
            return
        idx = self.photo_tree.index(sel[0])
        if idx < len(self.photos):
            self._show_preview(self.photos[idx])

    def _show_preview(self, photo):
        path = photo["path"]
        try:
            img = Image.open(path)
            img.thumbnail((280, 240))
            photo_img = ImageTk.PhotoImage(img)
            self.preview_label.configure(image=photo_img, text="")
            self.preview_label._image = photo_img

            info = []
            info.append(f"📄 {Path(path).name}")
            if photo.get("date"):
                info.append(f"📅 {photo['date'].strftime('%Y-%m-%d %H:%M')}")
            if photo.get("lat"):
                info.append(f"📍 {photo.get('country','?')} {photo.get('city','?')}")
                info.append(f"    ({photo['lat']:.4f}, {photo['lon']:.4f})")
            sz = os.path.getsize(path)
            info.append(f"💾 {sz/1024/1024:.1f} MB")
            self.info_label.configure(text="\n".join(info))
        except Exception as e:
            self.preview_label.configure(image="", text=f"미리보기 불가\n{e}")

    def _show_settings(self):
        win = tk.Toplevel(self.root)
        win.title("설정")
        win.geometry("360x200")
        win.configure(bg=COLORS["card"])
        tk.Label(win, text="폴더 이름 형식",
                 bg=COLORS["card"], fg=COLORS["text"],
                 font=("Helvetica", 10, "bold")).pack(padx=20, pady=16, anchor="w")
        tk.Label(win, text="현재: YYYY_국가_도시  (예: 2024_한국_서울)",
                 bg=COLORS["card"], fg=COLORS["text2"],
                 font=("Helvetica", 9)).pack(padx=20, anchor="w")
        tk.Label(win, text="GPS 없는 사진: YYYY_날짜미상 폴더로 이동",
                 bg=COLORS["card"], fg=COLORS["text2"],
                 font=("Helvetica", 9)).pack(padx=20, pady=4, anchor="w")

    # ── 스캔 ──────────────────────────────────────────────
    def _start_scan(self):
        src = self.source_dir.get()
        if not src or not os.path.isdir(src):
            messagebox.showerror("오류", "올바른 원본 폴더를 선택하세요.")
            return
        self._stop_scan = False
        self.photos = []
        for tree in [self.photo_tree, self.groups_tree, self.dups_tree]:
            tree.delete(*tree.get_children())
        threading.Thread(target=self._scan_worker, daemon=True).start()

    def _scan_worker(self):
        src = self.source_dir.get()
        exts = {'.jpg', '.jpeg', '.png', '.heic', '.tiff', '.bmp', '.webp'}
        all_files = [f for f in Path(src).rglob("*") if f.suffix.lower() in exts]
        total = len(all_files)
        self._set_status(f"스캔 중... 총 {total}개 사진 발견")

        hash_map = {}  # hash → first_path (중복 탐지용)

        for i, fpath in enumerate(all_files):
            if self._stop_scan:
                break
            try:
                exif   = get_exif_data(str(fpath))
                lat, lon = get_gps_from_exif(exif)
                date   = get_date_from_exif(exif)
                if not date:
                    stat = fpath.stat()
                    date = datetime.fromtimestamp(stat.st_mtime)

                country, city = ("", "")
                if lat and lon:
                    country, city = coords_to_location(lat, lon)

                # 중복 탐지
                h = get_image_hash(str(fpath))
                is_dup = h in hash_map
                if not is_dup:
                    hash_map[h] = str(fpath)

                sz = fpath.stat().st_size
                photo = {
                    "path": str(fpath),
                    "name": fpath.name,
                    "date": date,
                    "lat": lat, "lon": lon,
                    "country": country, "city": city,
                    "hash": h,
                    "is_dup": is_dup,
                    "dup_of": hash_map[h] if is_dup else None,
                    "size": sz,
                }
                self.photos.append(photo)

                pct = int((i+1) / total * 100)
                self.root.after(0, lambda p=photo, pr=pct, idx=i: self._update_scan_ui(p, pr, idx))
            except Exception as ex:
                pass

        self.root.after(0, self._finish_scan)

    def _update_scan_ui(self, photo, pct, idx):
        self.progress["value"] = pct
        date_str = photo["date"].strftime("%Y-%m-%d") if photo["date"] else "-"
        loc_str  = f"{photo['country']} {photo['city']}" if photo["lat"] else "GPS 없음"
        sz_str   = f"{photo['size']/1024:.0f} KB"
        tag = "dup" if photo["is_dup"] else ""
        self.photo_tree.insert("", "end",
                               values=(photo["name"], date_str, loc_str, sz_str),
                               tags=(tag,))
        self.photo_tree.tag_configure("dup", foreground=COLORS["warn"])

    def _finish_scan(self):
        total  = len(self.photos)
        gps    = sum(1 for p in self.photos if p["lat"])
        dups   = sum(1 for p in self.photos if p["is_dup"])

        # 위치 그룹핑
        gps_photos = [p for p in self.photos if p["lat"]]
        if gps_photos:
            cluster_map = cluster_by_location(gps_photos)
            groups = defaultdict(list)
            for idx, label in cluster_map.items():
                groups[label].append(gps_photos[idx])
        else:
            groups = {}

        num_groups = len(groups)

        self.stat_total.set(str(total))
        self.stat_gps.set(str(gps))
        self.stat_dup.set(str(dups))
        self.stat_groups.set(str(num_groups))
        self.progress["value"] = 0

        # 그룹 탭 채우기
        self.groups_tree.delete(*self.groups_tree.get_children())
        for label, photos in sorted(groups.items(), key=lambda x: len(x[1]), reverse=True):
            sample = photos[0]
            dates  = [p["date"] for p in photos if p["date"]]
            date_range = ""
            if dates:
                date_range = f"{min(dates).strftime('%Y-%m-%d')} ~ {max(dates).strftime('%Y-%m-%d')}"
            folder_name = f"{sample['date'].year if sample['date'] else '????'}_{sample['country']}_{sample['city']}"
            self.groups_tree.insert("", "end",
                                    values=(folder_name, sample["country"], sample["city"],
                                            len(photos), date_range))

        # 중복 탭
        self.dups_tree.delete(*self.dups_tree.get_children())
        for p in self.photos:
            if p["is_dup"]:
                sz = f"{p['size']/1024:.0f} KB"
                dt = p["date"].strftime("%Y-%m-%d") if p["date"] else "-"
                self.dups_tree.insert("", "end",
                                      values=(Path(p["dup_of"]).name, p["name"], sz, dt))

        self._set_status(
            f"✅ 스캔 완료 — {total}개 사진 | GPS {gps}개 | 중복 {dups}개 | 위치 그룹 {num_groups}개"
        )

    # ── 정리 실행 ──────────────────────────────────────────
    def _start_organize(self):
        if not self.photos:
            messagebox.showinfo("안내", "먼저 스캔을 실행하세요.")
            return
        out = self.output_dir.get()
        if not out:
            messagebox.showerror("오류", "저장 폴더를 선택하세요.")
            return

        move = self.opt_move.get()
        action = "이동" if move else "복사"
        ok = messagebox.askyesno("확인",
            f"사진을 {action}하여 정리하시겠습니까?\n"
            f"저장 위치: {out}\n\n"
            f"총 {len(self.photos)}개 사진, "
            f"중복 {sum(1 for p in self.photos if p['is_dup'])}개 제외")
        if ok:
            threading.Thread(target=self._organize_worker, daemon=True).start()

    def _organize_worker(self):
        out = Path(self.output_dir.get())
        move = self.opt_move.get()
        skip_dup = self.opt_dup.get()

        done = skipped = 0
        total = len(self.photos)

        for i, photo in enumerate(self.photos):
            if skip_dup and photo["is_dup"]:
                skipped += 1
                continue

            # 폴더명 결정
            date = photo["date"]
            year = date.year if date else "연도불명"
            month = date.strftime("%m") if date else "00"

            if photo["lat"] and self.opt_loc.get():
                folder = f"{year}_{photo['country']}_{photo['city']}"
            elif self.opt_date.get():
                folder = f"{year}_{month}"
            else:
                folder = "기타"

            dest_dir = out / folder
            dest_dir.mkdir(parents=True, exist_ok=True)
            dest = dest_dir / Path(photo["path"]).name

            # 동명 파일 처리
            if dest.exists():
                stem = dest.stem
                suffix = dest.suffix
                n = 1
                while dest.exists():
                    dest = dest_dir / f"{stem}_{n}{suffix}"
                    n += 1

            try:
                if move:
                    shutil.move(photo["path"], dest)
                else:
                    shutil.copy2(photo["path"], dest)
                done += 1
            except Exception as e:
                pass

            pct = int((i+1) / total * 100)
            self.root.after(0, lambda pr=pct, d=done: self._set_progress(pr, d))

        self.root.after(0, lambda: self._finish_organize(done, skipped))

    def _set_progress(self, pct, done):
        self.progress["value"] = pct
        self._set_status(f"정리 중... {done}개 처리 완료")

    def _finish_organize(self, done, skipped):
        self.progress["value"] = 0
        self._set_status(f"✅ 정리 완료 — {done}개 처리, 중복 {skipped}개 건너뜀")
        messagebox.showinfo("완료",
            f"사진 정리가 완료되었습니다!\n\n"
            f"✅ 처리: {done}개\n"
            f"🔁 건너뜀(중복): {skipped}개\n"
            f"📁 저장 위치: {self.output_dir.get()}")

    def _remove_selected_dups(self):
        sel = self.dups_tree.selection()
        if not sel:
            messagebox.showinfo("안내", "제거할 중복 사진을 선택하세요.")
            return
        ok = messagebox.askyesno("경고", f"선택한 {len(sel)}개 중복 파일을 삭제하시겠습니까?\n⚠️ 복구 불가")
        if ok:
            removed = 0
            for item in sel:
                vals = self.dups_tree.item(item)["values"]
                dup_name = vals[1]
                for p in self.photos:
                    if Path(p["path"]).name == dup_name and p["is_dup"]:
                        try:
                            os.remove(p["path"])
                            removed += 1
                        except:
                            pass
                self.dups_tree.delete(item)
            self._set_status(f"🗑 {removed}개 중복 파일 삭제 완료")

    def _set_status(self, msg):
        self.status_var.set(msg)

# ── 스타일 ────────────────────────────────────────────────
def apply_styles():
    style = ttk.Style()
    style.theme_use("clam")
    style.configure("Treeview",
                    background=COLORS["card2"],
                    foreground=COLORS["text"],
                    fieldbackground=COLORS["card2"],
                    rowheight=26,
                    font=("Helvetica", 9))
    style.configure("Treeview.Heading",
                    background=COLORS["card"],
                    foreground=COLORS["text2"],
                    font=("Helvetica", 9, "bold"))
    style.map("Treeview",
              background=[("selected", COLORS["accent"])],
              foreground=[("selected", "white")])
    style.configure("Horizontal.TProgressbar",
                    troughcolor=COLORS["card2"],
                    background=COLORS["accent"],
                    thickness=6)
    style.configure("TSeparator", background=COLORS["border"])

# ── 진입점 ────────────────────────────────────────────────
if __name__ == "__main__":
    root = tk.Tk()
    apply_styles()
    app = PhotoOrganizerApp(root)
    root.mainloop()
