$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Local web server successfully started at http://localhost:$port/"
} catch {
    Write-Host "Port $port might be in use, trying port 8080..."
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    Write-Host "Local web server successfully started at http://localhost:$port/"
}

$workspacePath = "c:\Users\willq\OneDrive\Documents\AI Project"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        
        # Handle OPTIONS preflight requests globally
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Target-Url")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # Handle local translation proxy endpoint
        if ($urlPath -eq "/api/translate") {
            $targetUrl = $request.Headers["X-Target-Url"]
            if ($null -eq $targetUrl -or $targetUrl -eq "") {
                $targetUrl = $request.QueryString["url"]
            }
            $authHeader = $request.Headers["Authorization"]
            $userAgentHeader = $request.Headers["User-Agent"]
            
            Write-Host "[PROXY-REQUEST] Method: $($request.HttpMethod), Target: $targetUrl, Auth: $authHeader, UA: $userAgentHeader"
            
            try {
                $headers = @{}
                if ($null -ne $authHeader -and $authHeader -ne "") {
                    $headers.Add("Authorization", $authHeader)
                }
                if ($null -ne $userAgentHeader -and $userAgentHeader -ne "") {
                    $headers.Add("User-Agent", $userAgentHeader)
                }
                
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Target-Url")
                $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                
                if ($request.HttpMethod -eq "GET") {
                    # Make target GET request using Invoke-WebRequest
                    $res = Invoke-WebRequest -Uri $targetUrl -Method Get -Headers $headers -UseBasicParsing
                    $resBytes = $res.RawContentStream.ToArray()
                    
                    Write-Host "[PROXY-SUCCESS] Target GET returned response."
                    
                    $response.ContentType = $res.Headers["Content-Type"]
                    if ($null -eq $response.ContentType -or $response.ContentType -eq "") {
                        $response.ContentType = "audio/mpeg"
                    }
                    $response.ContentLength64 = $resBytes.Length
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } else {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                    $body = $reader.ReadToEnd()
                    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
                    
                    # Make target POST request using Invoke-WebRequest
                    $headers.Add("Content-Type", "application/json")
                    $res = Invoke-WebRequest -Uri $targetUrl -Method Post -Headers $headers -Body $bodyBytes -ContentType "application/json; charset=utf-8" -UseBasicParsing
                    $resBytes = $res.RawContentStream.ToArray()
                    
                    Write-Host "[PROXY-SUCCESS] Target POST returned response."
                    
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.ContentLength64 = $resBytes.Length
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                }
            } catch {
                $errText = $_.Exception.Message
                if ($null -ne $_.Exception.Response) {
                    $errStream = $_.Exception.Response.GetResponseStream()
                    if ($null -ne $errStream) {
                        $errReader = New-Object System.IO.StreamReader($errStream)
                        $errText = $errReader.ReadToEnd()
                    }
                }
                Write-Host "[PROXY-ERROR] Request failed: $errText"
                
                $response.StatusCode = 500
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errText)
                $response.ContentType = "application/json"
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
            continue
        }

        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Strip leading slash for Join-Path
        $relPath = $urlPath.TrimStart('/')
        $filePath = Join-Path $workspacePath $relPath
        
        Write-Host "[SERVER-REQUEST] Path: $urlPath, Resolved File: $filePath"
        
        if (Test-Path $filePath -PathType Leaf) {
            Write-Host "[SERVER-SUCCESS] Serving: $filePath"
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            if ($extension -eq ".html" -or $extension -eq ".htm") { $contentType = "text/html" }
            elseif ($extension -eq ".css") { $contentType = "text/css" }
            elseif ($extension -eq ".js") { $contentType = "text/javascript" }
            elseif ($extension -eq ".jpg" -or $extension -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($extension -eq ".png") { $contentType = "image/png" }
            elseif ($extension -eq ".svg") { $contentType = "image/svg+xml" }
            
            # Disable caching completely so updates to index.html are instantly loaded
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.Headers.Add("Pragma", "no-cache")
            $response.Headers.Add("Expires", "0")
            
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            Write-Host "[SERVER-404] File NOT found: $filePath"
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # Handle request exceptions gracefully to keep listener alive
        if ($null -ne $response) {
            try { $response.Close() } catch {}
        }
    }
}
