// A desktop browser and a phone, each showing the invitation at its real
// layout width, scaled down into the frame. TemplateDetail scrolls them.

function Screen({ width, children }) {
  return (
    <div className="ds">
      <div className="ds-inner" data-w={width} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

export default function DevicePreview({ url, children }) {
  return (
    <div className="dp">
      <div className="dp-desktop">
        <div className="dp-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>{url}</p>
        </div>
        <Screen width={1280}>{children}</Screen>
      </div>
      <div className="dp-phone">
        <div className="dp-phone-body">
          <Screen width={390}>{children}</Screen>
          <span className="dp-notch" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
