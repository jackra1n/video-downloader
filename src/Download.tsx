import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

function Download() {

  const [url, setUrl] = useState("")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Download</CardTitle>
        <CardDescription>
          Download videos from YouTube, Instagram, Twitter and more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input value={url} onChange={e => setUrl(e.target.value)} type="url" placeholder="URL" />
      </CardContent>
      <CardFooter className="float-right">
        <Button disabled={url === ""} className="hover:cursor-pointer">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Download
