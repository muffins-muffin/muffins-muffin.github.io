<#
Optimize images for the site using ImageMagick.

Usage (PowerShell):
  # Default (process assets/images)
  .\scripts\optimize-images.ps1

  # Specify source directory and options
  .\scripts\optimize-images.ps1 -SourceDir "assets/images" -DesktopWidth 2000 -MobileWidth 1200 -Quality 80

Requirements:
 - ImageMagick must be installed and `magick` available on PATH.
 - Run in repository root (or provide full paths).

What the script does:
 - Finds JPG/PNG files in the source dir (non-recursive by default)
 - Produces desktop and mobile resized JPEGs and WebP variants with suffixes:
     - {name}-desktop.jpg
     - {name}-mobile.jpg
     - {name}-desktop.webp
     - {name}-mobile.webp
 - Keeps the original file untouched.

#>
[CmdletBinding()]
param(
    [string]$SourceDir = "assets/images",
    [int]$DesktopWidth = 2000,
    [int]$MobileWidth = 1200,
    [int]$Quality = 80,
    [switch]$Recursive
)

function Write-ErrAndExit($msg){
    Write-Error $msg
    exit 1
}

# Check magick availability
try {
    $null = & magick -version 2>&1
} catch {
    Write-ErrAndExit "ImageMagick 'magick' is not available on PATH. Install ImageMagick first: https://imagemagick.org/script/download.php#windows"
}

$absSource = Resolve-Path -Path $SourceDir -ErrorAction SilentlyContinue
if (-not $absSource) {
    Write-ErrAndExit "Source directory '$SourceDir' not found. Run the script from the repo root or specify -SourceDir with an absolute path."
}
$absSource = $absSource.Path

$searchOption = if ($Recursive) { 'Recurse' } else { 'TopDirectoryOnly' }

Write-Host "Optimizing images in: $absSource" -ForegroundColor Cyan
Write-Host "Desktop width: $DesktopWidth, Mobile width: $MobileWidth, Quality: $Quality`%"

$patterns = @('*.jpg','*.jpeg','*.png')
$images = Get-ChildItem -Path $absSource -Include $patterns -File -$searchOption
if (-not $images) {
    Write-Host "No images found in $absSource" -ForegroundColor Yellow
    exit 0
}

foreach ($img in $images) {
    $full = $img.FullName
    $name = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
    $ext = [System.IO.Path]::GetExtension($img.Name)

    # Desktop JPEG
    $desktopJpg = Join-Path $img.DirectoryName "${name}-desktop.jpg"
    & magick "$full" -strip -resize "${DesktopWidth}>" -quality $Quality "$desktopJpg"
    if ($LASTEXITCODE -ne 0) { Write-Warning "Failed to write $desktopJpg" }

    # Mobile JPEG
    $mobileJpg = Join-Path $img.DirectoryName "${name}-mobile.jpg"
    & magick "$full" -strip -resize "${MobileWidth}>" -quality $Quality "$mobileJpg"
    if ($LASTEXITCODE -ne 0) { Write-Warning "Failed to write $mobileJpg" }

    # Desktop WebP
    $desktopWebp = Join-Path $img.DirectoryName "${name}-desktop.webp"
    & magick "$full" -strip -resize "${DesktopWidth}>" -quality $Quality "$desktopWebp"
    if ($LASTEXITCODE -ne 0) { Write-Warning "Failed to write $desktopWebp" }

    # Mobile WebP
    $mobileWebp = Join-Path $img.DirectoryName "${name}-mobile.webp"
    & magick "$full" -strip -resize "${MobileWidth}>" -quality $Quality "$mobileWebp"
    if ($LASTEXITCODE -ne 0) { Write-Warning "Failed to write $mobileWebp" }

    Write-Host "Optimized: $($img.Name) -> desktop/mobile JPG+WEBP" -ForegroundColor Green
}

Write-Host "Done." -ForegroundColor Cyan
