# 이미지 설정 및 최적화

이 문서는 히어로 배경 이미지를 사이트에 적용하고 최적화하는 방법을 안내합니다.

## 권장 이미지
- 권장 출처: Unsplash, Pexels, Pixabay
- 권장 크기: 데스크톱 2000–3000px 너비, 모바일 800–1200px 너비
- 파일명(권장): `background-galaxy.jpg` (데스크톱 원본), `background-galaxy-mobile.jpg` (선택)
- 경로: `assets/images/`

## 라이선스 주의
- 이미지에 워터마크가 있으면 사용하지 마세요(라이선스 구매 필요).
- Unsplash/Pexels/Pixabay의 이미지는 대체로 상업적 사용이 허용되지만, 모델 릴리스나 상표권을 확인하세요.

## 스크립트로 최적화하기
리포지토리에 `scripts/optimize-images.ps1` (PowerShell) 스크립트가 추가되어 있습니다. 이 스크립트는 ImageMagick(`magick`)을 사용하여 다음 파일을 생성합니다:
- `{name}-desktop.jpg`
- `{name}-mobile.jpg`
- `{name}-desktop.webp`
- `{name}-mobile.webp`

사용 예 (PowerShell):
```powershell
# 저장소 루트에서
.
\scripts\optimize-images.ps1 -SourceDir "assets/images" -DesktopWidth 2000 -MobileWidth 1200 -Quality 80
```

ImageMagick 설치가 필요합니다: https://imagemagick.org/script/download.php#windows

## Jekyll에 반영하기
- 이미지를 `assets/images/background-galaxy.jpg`로 저장하세요.
- `index.md`의 `header.overlay_image`는 이미 `/assets/images/background-galaxy.jpg`로 되어 있습니다.
- 모바일에 따라 다른 이미지를 사용하려면 `index.md`에서 `header`를 변경하거나 SCSS에서 미디어 쿼리를 추가하세요.

## 모바일 대체 이미지 적용 (권장)
`assets/css/main.scss`에 모바일 미디어 쿼리가 이미 있습니다. 모바일 전용 저해상도 이미지를 생성했다면 SCSS를 아래처럼 조정할 수 있습니다:

```scss
@media (max-width: 640px) {
  body {
    background-image: linear-gradient(rgba(11,16,32,0.7), rgba(11,16,32,0.7)), url('/assets/images/background-galaxy-mobile.jpg');
  }
}
```

---
필요하시면 제가 이 README를 리포지토리에 커밋하고, SCSS를 mobile 이미지 사용으로 자동 전환하도록 패치해 드리겠습니다.