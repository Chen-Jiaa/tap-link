import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,  } from "recharts";

// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface RedirectLog {
  createdAt: string
  id: string
  redirectedUrl: string
  userAgent: null | string
}

export default function Analytics() {
  const [data, setData] = useState<RedirectLog[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/redirect-logs")
      
      if (!res.ok) {
        console.error("API failed:", await res.text())
        return
      }

      const json = await res.json() as RedirectLog[]
      setData(json)
    }

    void fetchData()
  }, [])

  const groupedByDate = data.reduce<Record<string, number>>((acc, log) => {
    const date = new Date(log.createdAt).toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(groupedByDate).map(([date, count]) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short"
    })
    return {
      count,
      date: formattedDate,
    }
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  console.log(data)

  console.log(chartData)

  return (
    <div className="grid gap-4 ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Redirect Analytics</h2>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Last 7 Days</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      <Card className="mt-4">
        <CardContent className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="black" type="linear"/>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.length}</div>
            {/* <div className="text-sm text-muted-foreground">+12% from last week</div> */}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">16</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Malaysia</div>
          </CardContent>
        </Card> */}
      </div>      
    </div>
  );
}