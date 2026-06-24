Add-Type -AssemblyName System.Drawing

$root = "C:\Users\KORNU-USER\Desktop\02"
$screenshotDir = Join-Path $root "SCREENSHOT"
$dest = Join-Path $root "frontend\public\assets\grandma-hero-v2.png"

$files = Get-ChildItem -LiteralPath $screenshotDir -Filter "*.png" |
  Sort-Object Name |
  Select-Object -ExpandProperty FullName

$srcPaths = @($files[2], $files[3], $files[4])

function New-ScaledBitmap {
  param(
    [System.Drawing.Image]$Src,
    [int]$Width,
    [int]$Height
  )

  $bmp = New-Object System.Drawing.Bitmap $Width, $Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(15, 11, 8))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $ratio = [Math]::Max($Width / $Src.Width, $Height / $Src.Height)
  $drawW = [int]([Math]::Ceiling($Src.Width * $ratio))
  $drawH = [int]([Math]::Ceiling($Src.Height * $ratio))
  $x = [int](($Width - $drawW) / 2)
  $y = [int](($Height - $drawH) / 2)

  $g.DrawImage($Src, $x, $y, $drawW, $drawH)
  $g.Dispose()
  return $bmp
}

$canvas = New-Object System.Drawing.Bitmap 1600, 1000
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(10, 8, 6))

$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Rectangle 0,0,1600,1000),
  [System.Drawing.Color]::FromArgb(35, 24, 17),
  [System.Drawing.Color]::FromArgb(8, 6, 5),
  90
)
$g.FillRectangle($bgBrush, 0, 0, 1600, 1000)
$bgBrush.Dispose()

$src1 = [System.Drawing.Image]::FromFile($srcPaths[0])
$src2 = [System.Drawing.Image]::FromFile($srcPaths[1])
$src3 = [System.Drawing.Image]::FromFile($srcPaths[2])

try {
  $main = New-ScaledBitmap -Src $src1 -Width 980 -Height 1000
  $left = New-ScaledBitmap -Src $src2 -Width 420 -Height 420
  $right = New-ScaledBitmap -Src $src3 -Width 420 -Height 420

  $g.DrawImage($main, 620, 0, 980, 1000)

  $overlayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(128, 8, 6, 5))
  $g.FillRectangle($overlayBrush, 620, 0, 980, 1000)
  $overlayBrush.Dispose()

  $g.DrawImage($main, 620, 0, 980, 1000)

  $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 227, 180, 95), 10)
  $g.DrawRectangle($framePen, 610, 10, 1000, 980)
  $framePen.Dispose()

  $circleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 22, 18, 16))
  $g.FillEllipse($circleBrush, 90, 90, 460, 460)
  $g.FillEllipse($circleBrush, 110, 500, 460, 460)
  $circleBrush.Dispose()

  $g.DrawImage($left, 110, 110, 420, 420)
  $g.DrawImage($right, 130, 520, 420, 420)

  $penSoft = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 227, 180, 95), 4)
  $g.DrawEllipse($penSoft, 88, 88, 464, 464)
  $g.DrawEllipse($penSoft, 108, 498, 464, 464)
  $penSoft.Dispose()

  $main.Dispose()
  $left.Dispose()
  $right.Dispose()
}
finally {
  $g.Dispose()
  $src1.Dispose()
  $src2.Dispose()
  $src3.Dispose()
}

$canvas.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Dispose()
