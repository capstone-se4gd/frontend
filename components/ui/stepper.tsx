"use client"

import { Check } from "lucide-react"

interface Step {
  id: string
  title: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden sm:flex">
        <ol className="flex items-center w-full flex-wrap">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? "w-full sm:w-auto sm:flex-1" : ""} mb-2 sm:mb-0`}
            >
              <button
                type="button"
                className={`flex items-center ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => onStepClick && onStepClick(index)}
                disabled={index > currentStep}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index < currentStep
                      ? "bg-[#12b784] border-[#12b784] text-[#FCFCFC]"
                      : index === currentStep
                        ? "border-[#12b784] text-[#12b784]"
                        : "border-gray-300 text-gray-500"
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                </span>
                <span
                  className={`ml-2 text-sm font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-400"}`}
                >
                  {step.title}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block flex-1 h-0.5 mx-4 ${index < currentStep ? "bg-[#12b784]" : "bg-gray-200"}`}
                ></div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-900">{steps[currentStep].title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#12b784] h-2.5 rounded-full"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
