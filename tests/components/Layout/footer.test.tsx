import "@testing-library/jest-dom"
import {render, screen} from "@testing-library/react"
import Footer from "@/components/layout/Footer"

describe("Index page", () => {
  it("should render", () => {
    render(<Footer />)
    const copyrightText = screen.getByTestId("copyright")
    expect(copyrightText).toBeInTheDocument()
    expect(copyrightText).toHaveTextContent("Sitecore All Rights Reserved.")
  })
})
