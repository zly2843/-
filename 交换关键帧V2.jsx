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
  var helpButton = group.add("button", undefined, "帮助");

  var keyFrameGroup = panel.add("group");
  keyFrameGroup.alignChildren = "left";
  var keyFrame1Input = keyFrameGroup.add('edittext {preferredSize: [50, 20]}');
  var keyFrame2Input = keyFrameGroup.add('edittext {preferredSize: [50, 20]}');
  keyFrame1Input.text = "1";
  keyFrame2Input.text = "2";

  helpButton.onClick = function () {
    alert("请选择要交换关键帧的图层和属性，然后在输入框中输入要交换的关键帧的索引。点击 '交换关键帧' 后，这两个关键帧将交换。");
  };

  button.onClick = function () {
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
      alert("请选择一个合成！");
      return;
    }

    var selectedLayers = comp.selectedLayers;

    if (selectedLayers.length < 1) {
      alert("请选择至少一个图层！");
      return;
    }

    for (var i = 0; i < selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      var prop = layer.property("Position");

      if (!prop) {
        alert("请选择一个属性！");
        return;
      }

      if (prop.numKeys < 2) {
        alert("该属性下至少需要两个关键帧！");
        return;
      }

      app.beginUndoGroup("关键帧交换");

      var keyIndex1 = parseInt(keyFrame1Input.text);
      var keyIndex2 = parseInt(keyFrame2Input.text);

      if (isNaN(keyIndex1) || isNaN(keyIndex2)) {
        alert("请输入有效的关键帧索引！");
        return;
      }

      if (keyIndex1 > prop.numKeys || keyIndex2 > prop.numKeys) {
        alert("关键帧索引超出范围！");
        return;
      }

      var keyValue1 = prop.keyValue(keyIndex1);
      var keyValue2 = prop.keyValue(keyIndex2);

      prop.setValueAtKey(keyIndex1, keyValue2);
      prop.setValueAtKey(keyIndex2, keyValue1);

      app.endUndoGroup();
    }

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

