"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OutlineButton } from "@/components/ui/outline-button"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [category, setCategory] = useState("all")

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-1">Visualize and analyze your sustainability data</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <OutlineButton onClick={() => setTimeRange("month")} className={timeRange === "month" ? "bg-gray-100" : ""}>
            Month
          </OutlineButton>
          <OutlineButton
            onClick={() => setTimeRange("quarter")}
            className={timeRange === "quarter" ? "bg-gray-100" : ""}
          >
            Quarter
          </OutlineButton>
          <OutlineButton onClick={() => setTimeRange("year")} className={timeRange === "year" ? "bg-gray-100" : ""}>
            Year
          </OutlineButton>
          <OutlineButton>
            <Calendar className="w-4 h-4 mr-2" />
            Custom
          </OutlineButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Emissions</CardTitle>
            <CardDescription>All scopes combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,245 kg CO2e</div>
            <div className="text-sm text-green-600 mt-1">↓ 12% from previous period</div>
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {/* Placeholder for chart */}
              <div className="w-1/12 h-[30%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[40%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[35%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[60%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[70%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[65%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[80%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[75%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[60%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-[#12b784] mx-[0.5%]"></div>
              <div className="w-1/12 h-[40%] bg-[#12b784] mx-[0.5%]"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Water Usage</CardTitle>
            <CardDescription>Total consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,500 liters</div>
            <div className="text-sm text-red-600 mt-1">↑ 5% from previous period</div>
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {/* Placeholder for chart */}
              <div className="w-1/12 h-[40%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[45%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[55%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[60%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[45%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[60%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[70%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[65%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[75%] bg-blue-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[80%] bg-blue-500 mx-[0.5%]"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Total usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8,750 kWh</div>
            <div className="text-sm text-green-600 mt-1">↓ 8% from previous period</div>
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {/* Placeholder for chart */}
              <div className="w-1/12 h-[80%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[75%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[70%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[65%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[60%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[55%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[45%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[40%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[45%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[50%] bg-yellow-500 mx-[0.5%]"></div>
              <div className="w-1/12 h-[45%] bg-yellow-500 mx-[0.5%]"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <CardTitle>Emissions by Category</CardTitle>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <OutlineButton onClick={() => setCategory("all")} className={category === "all" ? "bg-gray-100" : ""}>
                  All
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope1")}
                  className={category === "scope1" ? "bg-gray-100" : ""}
                >
                  Scope 1
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope2")}
                  className={category === "scope2" ? "bg-gray-100" : ""}
                >
                  Scope 2
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope3")}
                  className={category === "scope3" ? "bg-gray-100" : ""}
                >
                  Scope 3
                </OutlineButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-100 rounded p-4 flex items-end justify-around">
              {/* Placeholder for chart */}
              <div className="flex flex-col items-center w-1/5">
                <div className="h-[100px] w-full bg-[#12b784] rounded"></div>
                <div className="mt-2 text-sm">Furniture</div>
              </div>
              <div className="flex flex-col items-center w-1/5">
                <div className="h-[180px] w-full bg-[#12b784] rounded"></div>
                <div className="mt-2 text-sm">Textiles</div>
              </div>
              <div className="flex flex-col items-center w-1/5">
                <div className="h-[220px] w-full bg-[#12b784] rounded"></div>
                <div className="mt-2 text-sm">Electronics</div>
              </div>
              <div className="flex flex-col items-center w-1/5">
                <div className="h-[150px] w-full bg-[#12b784] rounded"></div>
                <div className="mt-2 text-sm">Packaging</div>
              </div>
              <div className="flex flex-col items-center w-1/5">
                <div className="h-[80px] w-full bg-[#12b784] rounded"></div>
                <div className="mt-2 text-sm">Other</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-gray-100 rounded p-4 flex items-center justify-center">
              {/* Placeholder for pie chart */}
              <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-[#12b784]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}
                ></div>
                <div
                  className="absolute inset-0 bg-blue-500"
                  style={{ clipPath: "polygon(0 0, 100% 0, 0 100%, 0 0)" }}
                ></div>
                <div
                  className="absolute inset-0 bg-yellow-500"
                  style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 100% 0)" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#12b784] rounded-full mr-2"></div>
                <span className="text-sm">Scope 1: 25%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Scope 2: 30%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">Scope 3: 45%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Efficiency</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Energy Efficiency</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Material Efficiency</span>
                  <span className="text-sm font-medium">93%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#12b784] h-2.5 rounded-full" style={{ width: "93%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Waste Reduction</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Products by Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Product</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Category</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Total Emissions</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Couch Model X</td>
                    <td className="py-3 px-4">Furniture</td>
                    <td className="py-3 px-4">450 kg CO2e</td>
                    <td className="py-3 px-4 text-green-600">↓ 12%</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Office Chair Pro</td>
                    <td className="py-3 px-4">Furniture</td>
                    <td className="py-3 px-4">320 kg CO2e</td>
                    <td className="py-3 px-4 text-green-600">↓ 8%</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Cotton Textile Batch</td>
                    <td className="py-3 px-4">Textiles</td>
                    <td className="py-3 px-4">280 kg CO2e</td>
                    <td className="py-3 px-4 text-red-600">↑ 5%</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Eco Packaging Set</td>
                    <td className="py-3 px-4">Packaging</td>
                    <td className="py-3 px-4">120 kg CO2e</td>
                    <td className="py-3 px-4 text-green-600">↓ 22%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">Smart Desk</td>
                    <td className="py-3 px-4">Furniture</td>
                    <td className="py-3 px-4">380 kg CO2e</td>
                    <td className="py-3 px-4 text-red-600">↑ 3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Carbon Reduction</span>
                  <span className="text-sm font-medium">65% / 80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#12b784] h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Conservation</span>
                  <span className="text-sm font-medium">50% / 70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Renewable Energy</span>
                  <span className="text-sm font-medium">75% / 90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Zero Waste</span>
                  <span className="text-sm font-medium">40% / 60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">Next Goal Milestone</h4>
              <p className="text-xs text-blue-700 mt-1">Reduce water consumption by 10% in the next quarter</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
