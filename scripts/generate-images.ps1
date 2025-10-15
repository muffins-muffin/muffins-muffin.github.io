<#
generate-images.ps1

Usage:
  Open PowerShell, navigate to repository root and run:
    .\scripts\generate-images.ps1 -SourceDir .\assets\img\slider -Widths 320,640,1024,2048 -GenerateAvif:$true -GenerateWebp:$true

Requirements:
 - ImageMagick (magick) must be in PATH.
 - Optional: Squoosh CLI for AVIF (if you prefer). This script uses ImageMagick's AVIF support if available.
#>

param(
  [string]$SourceDir = "assets/img/slider",
  [int[]]$Widths = @(320,640,1024,2048),
  [switch]$GenerateWebp = $true,
  [switch]$GenerateAvif = $true,
  [int]$JpegQuality = 85,
  [int]$WebpQuality = 80,
  [int]$AvifQuality = 60
)

if (-not (Test-Path $SourceDir)) {
  Write-Error "Source directory '$SourceDir' not found."
  exit 1
}

# Find images to process (jpg, jpeg, png)
$images = Get-ChildItem -Path $SourceDir -Include *.jpg,*.jpeg,*.png -File
if ($images.Count -eq 0) {
  Write-Host "No source JPG/PNG images found in $SourceDir"
  exit 0
}

Write-Host "Processing $($images.Count) images in $SourceDir..."

foreach ($img in $images) {
  $full = $img.FullName
  $base = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
  $ext = $img.Extension.TrimStart('.').ToLower()

  foreach ($w in $Widths) {
    $outJpg = Join-Path $SourceDir "$base-$w.jpg"
    Write-Host "Creating $outJpg"
    magick "$full" -resize ${w}x -quality $JpegQuality "$outJpg"

    if ($GenerateWebp) {
      $outWebp = Join-Path $SourceDir "$base-$w.webp"
      Write-Host "Creating $outWebp"
      magick "$full" -resize ${w}x -quality $WebpQuality "$outWebp"
    }

    if ($GenerateAvif) {
      $outAvif = Join-Path $SourceDir "$base-$w.avif"
      Write-Host "Creating $outAvif"
      # ImageMagick's avif write may differ by build; try-write and warn if fails
      try {
        magick "$full" -resize ${w}x -quality $AvifQuality "$outAvif" 2>$null
        if (-not (Test-Path $outAvif)) { throw }
      } catch {
        Write-Warning "Failed to create AVIF via ImageMagick for $full. If you need AVIF, consider installing Squoosh CLI and running it separately."
      }
    }
  }
}

Write-Host "Done. Check $SourceDir for generated files."
