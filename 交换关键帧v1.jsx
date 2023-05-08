(function (thisObj) {
  var scriptName = "关键帧交换";
  var windowName = "关键帧交换";

  var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", windowName, undefined, { resizeable: true });
  panel.alignChildren = "left";
  var creditText = panel.add("statictext", undefined, "张珑耀制作");
  creditText.alignment = "center";

  var group = panel.add("group");
  group.alignChildren = "left";
  var infoText = group.add("statictext", undefined, "请选择关键帧属性");
  var button = group.add("button", undefined, "交换关键帧");
  button.onClick = function () {
    var comp = app.project.activeItem;

    // 检查是否选择了图层
    if (!(comp && comp instanceof CompItem)) {
      alert("请选择一个合成！");
      return;
    }

    var selectedLayers = comp.selectedLayers;

    // 检查是否选择了一个图层
    if (selectedLayers.length !== 1) {
      alert("请选择一个图层！");
      return;
    }

    var layer = selectedLayers[0];
    var prop = layer.property("Position"); // 这里可以更改为其他属性

    // 检查是否选择了一个属性
    if (!prop) {
      alert("请选择一个属性！");
      return;
    }

    // 检查是否有关键帧
    if (prop.numKeys < 2) {
      alert("该属性下至少需要两个关键帧！");
      return;
    }

    app.beginUndoGroup("关键帧交换");

    var startTime = comp.time;
    var endTime = startTime + 1;

    var keyIndex1 = prop.nearestKeyIndex(startTime);
    var keyIndex2 = prop.nearestKeyIndex(endTime);

    // 获取关键帧值
    var keyValue1 = prop.keyValue(keyIndex1);
    var keyValue2 = prop.keyValue(keyIndex2);

    // 交换关键帧值
    prop.setValueAtKey(keyIndex1, keyValue2);
    prop.setValueAtKey(keyIndex2, keyValue1);

    app.endUndoGroup();

    alert("关键帧交换完成！");
  };

  panel.onResizing = panel.onResize = function () {
    this.layout.resize();
  };

  if (thisObj instanceof Panel) {
    panel.layout.layout(true);
    panel.layout.resize();
  } else {
    panel.center();
    panel.show();
  }
})(this);
