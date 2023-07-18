import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepDescription,
  StepSeparator,
  Box,
  VStack
} from "@chakra-ui/react"

interface ShipmentStepperProps {
  activeStep: number
  steps: string[]
}

export function ShipmentStepper({activeStep, steps}: ShipmentStepperProps) {
  return (
    <Stepper index={activeStep} colorScheme="primary">
      {steps.map((step, index) => (
        <Step key={index}>
          <VStack>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
          </VStack>

          <StepDescription>{step}</StepDescription>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
