import {Box, Progress, Heading, Tooltip, useColorModeValue} from "@chakra-ui/react"
import {useState, useEffect} from "react"
import {IProduct} from "types/ordercloud/IProduct"

type ProductDataProps = {
  product: IProduct
}

export function CalculateEditorialProcess(product: IProduct): number {
  var totalNumberOfFieldsToEdit = 4
  var currentNumberOfEditedFields = 0

  if ((product?.Description ?? "") != "") {
    currentNumberOfEditedFields++
  }
  if ((product?.DefaultPriceScheduleID ?? "") != "") {
    currentNumberOfEditedFields++
  }
  if (product?.Active ?? false) {
    currentNumberOfEditedFields++
  }
  if ((typeof product?.xp?.Images != "undefined" ? product?.xp?.Images[0].Url : "") != "") {
    currentNumberOfEditedFields++
  }

  var calculatedProgress = (currentNumberOfEditedFields / totalNumberOfFieldsToEdit) * 100

  return calculatedProgress
}

export default function EditorialProgressBar({product}: ProductDataProps) {
  const [progress, setProgress] = useState(0)
  const [progressColor, setProgressColor] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const color = useColorModeValue("textColor.900", "textColor.100")

  useEffect(() => {
    setIsLoading(true)

    var calculatedProgress = CalculateEditorialProcess(product)
    setProgress(calculatedProgress)

    let colorSchema = ""
    if (calculatedProgress == 0) {
      colorSchema = "blue"
    }
    if (calculatedProgress <= 25) {
      colorSchema = "red"
    } else if (calculatedProgress > 25 && calculatedProgress <= 50) {
      colorSchema = "orange"
    } else if (calculatedProgress > 50 && calculatedProgress <= 75) {
      colorSchema = "yellow"
    } else {
      colorSchema = "green"
    }
    setProgressColor(colorSchema)
    setIsLoading(false)
  }, [product])

  const heading = (
    <Heading mt={2} size={"sm"} color={color} fontWeight="normal">
      Editorial Progress {product && !isLoading ? ": " + progress + "%" : "..."}
    </Heading>
  )

  return (
    <Box>
      <Progress
        hasStripe={true}
        isIndeterminate={!product}
        value={progress}
        size={"lg"}
        colorScheme={product ? progressColor : "blue"}
      />
      {progress < 100 ? (
        <Tooltip label="Please upload image, and define Description, Default Price Schedule ID, and set Active to true">
          {heading}
        </Tooltip>
      ) : (
        heading
      )}
    </Box>
  )
}
