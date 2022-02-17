import "./index.scss"

wp.blocks.registerBlockType("wishing-tree/wishing-tree-block", {
  title: "Wishing Tree Block",
  icon: "palmtree",
  category: "common",
  attributes: {
    // skyColor: { type: "string" },
    // grassColor: { type: "string" },
    url: {type: "string"}
  },
  edit: EditComponent,
  save: function () {
    return null
  }
})

function EditComponent(props) {
  
  function updateUrl(e) {
    props.setAttributes({ url: e.target.value })
    console.log('url', e.target.value);
  }

  return (
    <div className="makeUpYourBlockTypeName">
      {/* <input type="text" value={props.attributes.skyColor} onChange={updateSkyColor} placeholder="sky color..." />
      <input type="text" value={props.attributes.grassColor} onChange={updateGrassColor} placeholder="grass color..." /> */}
      <label>Site URL: </label>
      <input type="text" size="20" value={props.attributes.url} onChange={updateUrl} placeholder="url..." />
    </div>
  )
}
