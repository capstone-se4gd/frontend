"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [batchInfo, setBatchInfo] = useState({
    batchId: "",
    productId: "",
  });

  useEffect(() => {
    // Get batch info from URL params or localStorage if not available
    const batchId = searchParams.get("batchId") || localStorage.getItem("createdBatchId") || "";
    const productId = searchParams.get("productId") || localStorage.getItem("createdProductId") || "";
    
    setBatchInfo({
      batchId,
      productId,
    });
  }, [searchParams]);

  return (
    <main className="max-w-4xl mx-auto py-12">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-0">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">
            Batch Created Successfully!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your sustainability data has been uploaded and processed.
          </p>
        </CardHeader>
        
        <CardContent className="pt-8 pb-8">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4">Batch Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Batch ID</p>
                <p className="text-base font-medium">{batchInfo.batchId}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Product ID</p>
                <p className="text-base font-medium">{batchInfo.productId}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3">
            {/* Button to see batch details */}
            <PrimaryButton 
              onClick={() => router.push(`/dashboard/batches/${batchInfo.batchId}`)}
              className="px-8 py-4 mr-4"
            >
              View Batch Details
            </PrimaryButton>
            {/* Button to go back to batches list */}
            <PrimaryButton 
              onClick={() => router.push("/dashboard/batches")}
              className="px-8 py-4"
            >
              Go to Batches
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
