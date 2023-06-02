import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

function Download() {

  const [url, setUrl] = useState("")

  return (
    <Card className="w-full max-w-screen-lg">
      <CardContent className="p-6">
        <Input value={url} onChange={e => setUrl(e.target.value)} type="url" placeholder="URL" />
        <Button disabled={url === ""} className="my-4 float-right hover:cursor-pointer">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Download
        </Button>
      </CardContent>
    </Card>
  )
}

export default Download
