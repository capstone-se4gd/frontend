import { ArrowUp } from "lucide-react"

export default function WaterConsumptionPage() {
  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar */}
      <div className="w-[92px] bg-[#e9e9e9] h-full"></div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-end px-8 py-4 border-b border-[#e9e9e9]">
          <div className="flex items-center gap-3">
            <span className="text-xl font-medium">Manu</span>
            <div className="rounded-full border border-[#000000] p-2">
              <ArrowUp className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-8 py-12">
          <h1 className="text-4xl font-bold mb-16">Water Consumption - Batch XXX</h1>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Product information */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-2xl font-medium">Product:</div>
              <div className="text-2xl col-span-3">Couch</div>
            </div>

            {/* Sustainability Metrics */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sustainability Metrics:</h2>
              <div className="grid grid-cols-4 gap-4">
                <div>Scope 1:</div>
                <div>X</div>
                <div className="col-span-2"></div>

                <div>Scope 2:</div>
                <div>X</div>
                <div className="col-span-2"></div>

                <div>Scope 3:</div>
                <div>X</div>
                <div className="col-span-2"></div>

                <div>Water Usage:</div>
                <div>X</div>
                <div className="col-span-2"></div>

                <div>Energy Consumption:</div>
                <div>X</div>
                <div className="col-span-2"></div>
              </div>
            </div>

            {/* Components */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Components:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Water Component */}
                <div className="border-2 border-[#000000] rounded-lg p-6">
                  <h3 className="text-xl font-medium text-center mb-4">Water</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Scope 1:</div>
                    <div>X</div>

                    <div>Scope 2:</div>
                    <div>X</div>

                    <div>Scope 3:</div>
                    <div>X</div>

                    <div>Water Usage:</div>
                    <div>X</div>

                    <div>Energy Consumption:</div>
                    <div>X</div>
                  </div>
                </div>

                {/* Electricity Component */}
                <div className="border-2 border-[#000000] rounded-lg p-6">
                  <h3 className="text-xl font-medium text-center mb-4">Electricity</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Scope 1:</div>
                    <div>X</div>

                    <div>Scope 2:</div>
                    <div>X</div>

                    <div>Scope 3:</div>
                    <div>X</div>

                    <div>Water Usage:</div>
                    <div>X</div>

                    <div>Energy Consumption:</div>
                    <div>X</div>
                  </div>
                </div>

                {/* Wood Component */}
                <div className="border-2 border-[#000000] rounded-lg p-6">
                  <h3 className="text-xl font-medium text-center mb-4">Wood</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Scope 1:</div>
                    <div>X</div>

                    <div>Scope 2:</div>
                    <div>X</div>

                    <div>Scope 3:</div>
                    <div>X</div>

                    <div>Water Usage:</div>
                    <div>X</div>

                    <div>Energy Consumption:</div>
                    <div>X</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
