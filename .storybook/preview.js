import "./tailwind.css";
import * as nextImage from "next/image"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

Object.defineProperty(nextImage, "default", {
  configurable: true,
  value: props => {
    const { width, height } = props
    const ratio = (height / width) * 100
    return (
      <div
        style={{
          paddingBottom: `${ratio}%`,
          position: "relative",
        }}
      >
        <img
          style={{
            objectFit: "cover",
            position: "absolute",
            minWidth: "100%",
            minHeight: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          {...props}
        />
      </div>
    )
  },
})
