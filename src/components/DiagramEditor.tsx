import {
  DiagramComponent,
  SymbolInfo,
  IDragEnterEventArgs,
  SymbolPaletteComponent,
  NodeModel,
  ConnectorModel,
  PointPortModel,
  Node,
  Connector,
  GridlinesModel,
  IExportOptions,
  DiagramTools,
  NodeConstraints,
  ConnectorConstraints,
  IHistoryChangeArgs,
  ISelectionChangeEventArgs,
  IScrollChangeEventArgs,
  PrintAndExport,
  UndoRedo,
  Inject,
} from "@syncfusion/ej2-react-diagrams";
import { ToolbarComponent } from "@syncfusion/ej2-react-navigations";
import { DropDownButton } from "@syncfusion/ej2-react-splitbuttons";
import "../styles/DiagramEditor.css";
import { useEffect } from "react";

//Initializes the nodes for the diagram
let nodes: NodeModel[] = [];
//Initializes the connector for the diagram
let connectors: ConnectorModel[] = [];

//Initialize the flowshapes for the symbol palatte
let flowshapes: NodeModel[] = [
  { id: "Terminator", shape: { type: "Flow", shape: "Terminator" } },
  { id: "Process", shape: { type: "Flow", shape: "Process" } },
  { id: "Document", shape: { type: "Flow", shape: "Document" } },
  {
    id: "PreDefinedProcess",
    shape: { type: "Flow", shape: "PreDefinedProcess" },
  },

  { id: "SequentialData", shape: { type: "Flow", shape: "SequentialData" } },

  { id: "Card", shape: { type: "Flow", shape: "Card" } },
];

//Initializes connector symbols for the symbol palette
let connectorSymbols: ConnectorModel[] = [
  {
    id: "Link1",
    type: "Orthogonal",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    targetDecorator: {
      shape: "Arrow",
      style: { strokeColor: "#757575", fill: "#757575" },
    },
    style: { strokeWidth: 1, strokeColor: "#757575" },
  },
  {
    id: "link3",
    type: "Orthogonal",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    style: { strokeWidth: 1, strokeColor: "#757575" },
    targetDecorator: { shape: "None" },
  },
  {
    id: "Link21",
    type: "Straight",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    targetDecorator: {
      shape: "Arrow",
      style: { strokeColor: "#757575", fill: "#757575" },
    },
    style: { strokeWidth: 1, strokeColor: "#757575" },
  },
];
let interval: number[];
interval = [
  1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
  0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
];
let gridlines: GridlinesModel = {
  lineColor: "#e0e0e0",
  lineIntervals: interval,
};
let diagramInstance: DiagramComponent;
let toolbarEditor: ToolbarComponent;
let toolbarItems: any = [
  { prefixIcon: "e-icons e-circle-add", tooltipText: "New Diagram" },
  { prefixIcon: "e-icons e-save", tooltipText: "Save Diagram" },
  { type: "Separator" },
  {
    disabled: true,
    prefixIcon: "e-cut e-icons",
    tooltipText: "Cut",
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  {
    disabled: true,
    prefixIcon: "e-copy e-icons",
    tooltipText: "Copy",
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  { prefixIcon: "e-icons e-paste", tooltipText: "Paste", disabled: true },
  { type: "Separator" },
  { disabled: true, prefixIcon: "e-icons e-undo", tooltipText: "Undo" },
  { disabled: true, prefixIcon: "e-icons e-redo", tooltipText: "Redo" },
  { type: "Separator" },
  {
    prefixIcon: "e-pan e-icons",
    tooltipText: "Pan Tool",
    cssClass: "tb-item-start pan-item",
  },
  {
    prefixIcon: "e-mouse-pointer e-icons",
    tooltipText: "Select Tool",
    cssClass: "tb-item-middle tb-item-selected",
  },
  {
    tooltipText: "Change Connector Type",
    template: '<button id="conTypeBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle",
  },
  {
    prefixIcon: "e-caption e-icons",
    tooltipText: "Text Tool",
    cssClass: "tb-item-end",
  },
  { type: "Separator" },
  {
    disabled: true,
    prefixIcon: "e-icons e-lock",
    tooltipText: "Lock",
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  {
    disabled: true,
    prefixIcon: "e-trash e-icons",
    tooltipText: "Delete",
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  { type: "Separator", align: "Center" },

  {
    disabled: true,
    type: "Input",
    tooltipText: "Align Objects",
    template: '<button id="alignBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle  tb-item-align-category",
  },
  {
    disabled: true,
    type: "Input",
    tooltipText: "Distribute Objects",
    template: '<button id="distributeBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle tb-item-space-category",
  },
  { type: "Separator" },
  {
    disabled: true,
    type: "Input",
    tooltipText: "Order Commands",
    template: '<button id="orderBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  { type: "Separator" },
  {
    disabled: true,
    type: "Input",
    tooltipText: "Group/Ungroup",
    template: '<button id="groupBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle tb-item-align-category",
  },
  { type: "Separator" },
  {
    disabled: true,
    type: "Input",
    tooltipText: "Rotate",
    template: '<button id="rotateBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  { type: "Separator" },
  {
    disabled: true,
    type: "Input",
    tooltipText: "Flip",
    template: '<button id="flipBtn" style="width:100%;"></button>',
    cssClass: "tb-item-middle tb-item-lock-category",
  },
  { type: "Separator" },
  {
    cssClass: "tb-item-end tb-zoom-dropdown-btn",
    template: '<button id="btnZoomIncrement"></button>',
  },
  { type: "Separator" },
  {
    template: '<input type="color" id="colorPicker" style="width:100%;" />',
    tooltipText: "Change Fill Color",
  },

  {
    prefixIcon: 'e-icons e-play',  
    tooltipText: 'Generate Workflow',
    text: 'Generate Workflow',
    cssClass: 'e-flat',
    click: generateWorkflow,  
  },
  {
    prefixIcon: 'e-icons e-upload-1',  
    tooltipText: 'Upload Workflow',
    text: 'Upload Workflow',
    cssClass: 'e-flat',
    click: uploadWorkflow,  
  },
];

function generateWorkflow(args) {
  // Add your logic for generating workflow here
  console.log('Generate Workflow clicked');
  // For example:
  // callYourApiToGenerateWorkflow();
}

function uploadWorkflow(args) {
  // Add your logic for uploading workflow here
  console.log('Upload Workflow clicked');
  // For example:
  // openFileDialog();
}

function Default() {
  function rendereComplete() {
    addEvents();
    diagramInstance.fitToPage();
  }
  function getPorts(): PointPortModel[] {
    let ports: PointPortModel[] = [
      { id: "port1", shape: "Circle", offset: { x: 0, y: 0.5 } },
      { id: "port2", shape: "Circle", offset: { x: 0.5, y: 1 } },
      { id: "port3", shape: "Circle", offset: { x: 1, y: 0.5 } },
      { id: "port4", shape: "Circle", offset: { x: 0.5, y: 0 } },
    ];
    return ports;
  }
  let isMobile: boolean;

  function addEvents(): void {
    isMobile = window.matchMedia("(max-width:550px)").matches;
    if (isMobile) {
      let paletteIcon: HTMLElement = document.getElementById("palette-icon");
      if (paletteIcon) {
        paletteIcon.addEventListener("click", openPalette, false);
      }
    }
  }
  function openPalette(): void {
    let paletteSpace: HTMLElement = document.getElementById("palette-space");
    isMobile = window.matchMedia("(max-width:550px)").matches;
    if (isMobile) {
      if (!paletteSpace.classList.contains("sb-mobile-palette-open")) {
        paletteSpace.classList.add("sb-mobile-palette-open");
      } else {
        paletteSpace.classList.remove("sb-mobile-palette-open");
      }
    }
  }

  function printDiagram(args: any) {
    let options: IExportOptions = {};
    options.mode = "Download";
    options.region = "Content";
    options.multiplePage = diagramInstance.pageSettings.multiplePage;
    options.pageHeight = diagramInstance.pageSettings.height;
    options.pageWidth = diagramInstance.pageSettings.width;
    diagramInstance.print(options);
  }
  //To enable toolbar items.
  function enableItems() {
    toolbarEditor.items[6].disabled = false;
    toolbarEditor.items[7].disabled = false;
    toolbarEditor.items[19].disabled = false;
    toolbarEditor.items[20].disabled = false;
    toolbarEditor.items[25].disabled = false;
    toolbarEditor.items[29].disabled = false;
    toolbarEditor.items[31].disabled = false;
  }
  //To disable toolbar items while multiselection.
  function disableMultiselectedItems() {
    toolbarEditor.items[22].disabled = true;
    toolbarEditor.items[23].disabled = true;
    toolbarEditor.items[27].disabled = true;
  }
  //To handle toolbar click
  function toolbarClick(args: any) {
    let item = args.item.tooltipText;
    switch (item) {
      case "Undo":
        diagramInstance.undo();
        break;
      case "Redo":
        diagramInstance.redo();
        break;
      case "Lock":
        lockObject(args);
        break;
      case "Cut":
        diagramInstance.cut();
        toolbarEditor.items[8].disabled = false;
        break;
      case "Copy":
        diagramInstance.copy();
        toolbarEditor.items[8].disabled = false;
        break;
      case "Paste":
        diagramInstance.paste();
        break;
      case "Delete":
        diagramInstance.remove();
        break;
      case "Select Tool":
        diagramInstance.clearSelection();
        diagramInstance.tool = DiagramTools.Default;
        break;
      case "Text Tool":
        diagramInstance.clearSelection();
        diagramInstance.selectedItems.userHandles = [];
        diagramInstance.drawingObject = { shape: { type: "Text" } };
        diagramInstance.tool = DiagramTools.ContinuousDraw;
        break;
      case "Pan Tool":
        diagramInstance.clearSelection();
        diagramInstance.tool = DiagramTools.ZoomPan;
        break;
      case "New Diagram":
        diagramInstance.clear();
        historyChange(args);
        break;
      case "Print Diagram":
        printDiagram(args);
        break;
      case "Save Diagram":
        download(diagramInstance.saveDiagram());
        break;
      case "Open Diagram":
        document
          .getElementsByClassName("e-file-select-wrap")[0]
          .querySelector("button")
          .click();
        break;
    }
    diagramInstance.dataBind();
  }
  //To change diagram zoom.
  function zoomChange(args: any) {
    let zoomCurrentValue: any = (
      document.getElementById("btnZoomIncrement") as any
    ).ej2_instances[0];
    let currentZoom: any = diagramInstance.scrollSettings.currentZoom;
    let zoom: any = {};
    switch (args.item.text) {
      case "Zoom In":
        diagramInstance.zoomTo({ type: "ZoomIn", zoomFactor: 0.2 });
        zoomCurrentValue.content =
          (diagramInstance.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "Zoom Out":
        diagramInstance.zoomTo({ type: "ZoomOut", zoomFactor: 0.2 });
        zoomCurrentValue.content =
          (diagramInstance.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "Zoom to Fit":
        zoom.zoomFactor = 1 / currentZoom - 1;
        diagramInstance.zoomTo(zoom);
        zoomCurrentValue.content = diagramInstance.scrollSettings.currentZoom;
        break;
      case "Zoom to 50%":
        if (currentZoom === 0.5) {
          currentZoom = 0;
          zoom.zoomFactor = 0.5 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        } else {
          zoom.zoomFactor = 0.5 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        }
        break;
      case "Zoom to 100%":
        if (currentZoom === 1) {
          currentZoom = 0;
          zoom.zoomFactor = 1 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        } else {
          zoom.zoomFactor = 1 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        }
        break;
      case "Zoom to 200%":
        if (currentZoom === 2) {
          currentZoom = 0;
          zoom.zoomFactor = 2 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        } else {
          zoom.zoomFactor = 2 / currentZoom - 1;
          diagramInstance.zoomTo(zoom);
        }
        break;
    }

    zoomCurrentValue.content =
      Math.round(diagramInstance.scrollSettings.currentZoom * 100) + " %";
  }
  let asyncSettings: any;
  function onConnectorSelect(args: any) {
    diagramInstance.clearSelection();
    diagramInstance.drawingObject = { type: args.item.text };
    diagramInstance.tool = DiagramTools.ContinuousDraw;
    diagramInstance.selectedItems.userHandles = [];
    diagramInstance.dataBind();
  }

  function onShapesSelect(args: any) {
    diagramInstance.clearSelection();
    diagramInstance.drawingObject = { shape: { shape: args.item.text } };
    diagramInstance.tool = DiagramTools.ContinuousDraw;
    diagramInstance.selectedItems.userHandles = [];
    diagramInstance.dataBind();
  }
  //Export the diagraming object based on the format.
  function onselectExport(args: any) {
    let exportOptions: IExportOptions = {};
    exportOptions.format = args.item.text;
    exportOptions.mode = "Download";
    exportOptions.region = "PageSettings";
    exportOptions.fileName = "Export";
    exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
    diagramInstance.exportDiagram(exportOptions);
  }

  function onSelectGroup(args: any) {
    if (args.item.text === "Group") {
      diagramInstance.group();
    } else if (args.item.text === "Ungroup") {
      diagramInstance.unGroup();
    }
  }

  function onSelectAlignObjects(args: any) {
    let item: any = args.item.text;
    let alignType = item.replace("Align", "");
    let alignType1 = alignType.charAt(0).toUpperCase() + alignType.slice(1);
    diagramInstance.align(alignType1.trim());
  }
  function onSelectDistributeObjects(args: any) {
    if (args.item.text === "Distribute Objects Vertically") {
      diagramInstance.distribute("BottomToTop");
    } else {
      diagramInstance.distribute("RightToLeft");
    }
  }
  //To execute order commands
  function onSelectOrder(args: any) {
    switch (args.item.text) {
      case "Bring Forward":
        diagramInstance.moveForward();
        break;
      case "Bring To Front":
        diagramInstance.bringToFront();
        break;
      case "Send Backward":
        diagramInstance.sendBackward();
        break;
      case "Send To Back":
        diagramInstance.sendToBack();
        break;
    }
  }

  function onSelectRotate(args: any) {
    if (args.item.text === "Rotate Clockwise") {
      diagramInstance.rotate(diagramInstance.selectedItems, 90);
    } else {
      diagramInstance.rotate(diagramInstance.selectedItems, -90);
    }
  }
  function onSelectFlip(args: any) {
    flipObjects(args.item.text);
  }

  // To flip diagram objects
  function flipObjects(flipType: any) {
    let selectedObjects = diagramInstance.selectedItems.nodes.concat(
      (diagramInstance.selectedItems as any).connectors
    );
    for (let i: number = 0; i < selectedObjects.length; i++) {
      selectedObjects[i].flip =
        flipType === "Flip Horizontal" ? "Horizontal" : "Vertical";
    }
    diagramInstance.dataBind();
  }

  function download(data: any) {
    if ((window.navigator as any).msSaveBlob) {
      let blob: Blob = new Blob([data], {
        type: "data:text/json;charset=utf-8,",
      });
      (window.navigator as any).msSaveOrOpenBlob(blob, "Diagram.json");
    } else {
      let dataString =
        "data:text/json;charset=utf-8," + encodeURIComponent(data);
      let ele = document.createElement("a");
      ele.href = dataString;
      ele.download = "Diagram.json";
      document.body.appendChild(ele);
      ele.click();
      ele.remove();
    }
  }

  function lockObject(args: any) {
    for (
      let i: number = 0;
      i < diagramInstance.selectedItems.nodes.length;
      i++
    ) {
      let node = diagramInstance.selectedItems.nodes[i];
      if (node.constraints & NodeConstraints.Drag) {
        node.constraints =
          NodeConstraints.PointerEvents | NodeConstraints.Select;
      } else {
        node.constraints = NodeConstraints.Default;
      }
    }
    for (
      let j: number = 0;
      j < diagramInstance.selectedItems.connectors.length;
      j++
    ) {
      let connector = diagramInstance.selectedItems.connectors[j];
      if (connector.constraints & ConnectorConstraints.Drag) {
        connector.constraints =
          ConnectorConstraints.PointerEvents | ConnectorConstraints.Select;
      } else {
        connector.constraints = ConnectorConstraints.Default;
      }
    }
    diagramInstance.dataBind();
  }

  function refreshOverflow() {
    setTimeout(() => {
      toolbarEditor.refreshOverflow();
    }, 100);
  }
  asyncSettings = {
    saveUrl:
      "https://services.syncfusion.com/react/production/api/FileUploader/Save",
    removeUrl:
      "https://services.syncfusion.com/react/production/api/FileUploader/Remove",
  };

  function handleColorChange(event: any) {
    const selectedNode = diagramInstance.selectedItems.nodes[0]; // Get the selected node
    if (selectedNode) {
      selectedNode.style.fill = event.target.value; // Apply the selected color as fill
      diagramInstance.dataBind(); // Ensure the diagram is updated with the new style
    }
  }

 

  // Add an event listener for the color picker when the toolbar is created
  useEffect(() => {
    const colorPicker = document.getElementById("colorPicker");
    if (colorPicker) {
      colorPicker.addEventListener("input", handleColorChange);
    }
  }, []);

  function loadDiagram(event: any) {
    diagramInstance.loadDiagram(event.target.result);
  }
  function historyChange(args: any) {
    if (diagramInstance.historyManager.undoStack.length > 0) {
      toolbarEditor.items[10].disabled = false;
    } else {
      toolbarEditor.items[10].disabled = true;
    }
    if (diagramInstance.historyManager.redoStack.length > 0) {
      toolbarEditor.items[11].disabled = false;
    } else {
      toolbarEditor.items[11].disabled = true;
    }
  }
  return (
    <div className="control-pane">
      <div className="db-toolbar-container" style={{  borderTop: "100px solid #e0e0e0" }}>
                <ToolbarComponent
                  ref={(toolbar) => (toolbarEditor = toolbar)}
                  id="toolbar_diagram"
                  created={() => {
                    if (diagramInstance !== undefined) {

                      const colorPicker =
                        document.getElementById("colorPicker");
                      if (colorPicker) {
                        colorPicker.addEventListener(
                          "input",
                          handleColorChange
                        );
                      }


                      let conTypeBtn: any = new DropDownButton({
                        items: [
                          { text: "Straight", iconCss: "e-icons e-line" },
                          {
                            text: "Orthogonal",
                            iconCss: "sf-diagram-icon-orthogonal",
                          },
                          { text: "Bezier", iconCss: "sf-diagram-icon-bezier" },
                        ],
                        // iconCss: "e-diagram-icons1 e-diagram-connector e-icons",
                        select: function (args) {
                          onConnectorSelect(args);
                        },
                      });
                      conTypeBtn.appendTo("#conTypeBtn");

                      let btnZoomIncrement: any = new DropDownButton({
                        items: [
                          { text: "Zoom In" },
                          { text: "Zoom Out" },
                          { text: "Zoom to Fit" },
                          { text: "Zoom to 50%" },
                          { text: "Zoom to 100%" },
                          { text: "Zoom to 200%" },
                        ],
                        content:
                          Math.round(
                            diagramInstance.scrollSettings.currentZoom * 100
                          ) + " %",
                        select: zoomChange,
                        disabled: true,
                      });
                      btnZoomIncrement.appendTo("#btnZoomIncrement");

                      let shapesBtn: any = new DropDownButton({
                        items: [
                          { text: "Rectangle", iconCss: "e-rectangle e-icons" },
                          { text: "Ellipse", iconCss: " e-circle e-icons" },
                          { text: "Polygon", iconCss: "e-line e-icons" },
                        ],
                        iconCss: "e-shapes e-icons",
                        select: function (args) {
                          onShapesSelect(args);
                        },
                      });
                      shapesBtn.appendTo("#shapesBtn");

                      let exportBtn: any = new DropDownButton({
                        items: [
                          { text: "JPG" },
                          { text: "PNG" },
                          { text: "SVG" },
                        ],
                        iconCss: "e-icons e-export",
                        select: function (args) {
                          onselectExport(args);
                        },
                      });
                      exportBtn.appendTo("#diagramexportBtn");

                      let groupBtn: any = new DropDownButton({
                        items: [
                          { text: "Group", iconCss: "e-icons e-group-1" },
                          { text: "Ungroup", iconCss: "e-icons e-ungroup-1" },
                        ],
                        iconCss: "e-icons e-group-1",
                        select: function (args) {
                          onSelectGroup(args);
                        },
                      });
                      groupBtn.appendTo("#groupBtn");


                      let alignBtn: any = new DropDownButton({
                        items: [
                          {
                            iconCss: "sf-diagram-icon-align-left-1",
                            text: "Align Left",
                          },
                          {
                            iconCss: "sf-diagram-icon-align-center-1",
                            text: "Align Center",
                          },
                          {
                            iconCss: "sf-diagram-icon-align-right-1",
                            text: "Align Ri ght",
                          },
                          {
                            iconCss: "sf-diagram-icon-align-top-1",
                            text: "Align Top",
                          },
                          {
                            iconCss: "sf-diagram-icon-align-middle-1",
                            text: "Align Middle",
                          },
                          {
                            iconCss: "sf-diagram-icon-align-bottom-1",
                            text: "Align Bottom",
                          },
                        ],
                        iconCss: "e-icons e-restart-at-1",
                        select: function (args) {
                          onSelectAlignObjects(args);
                        },
                      });
                      alignBtn.appendTo("#alignBtn");

                      let distributeBtn: any = new DropDownButton({
                        items: [
                          {
                            iconCss: "sf-diagram-icon-distribute-horizontal",
                            text: "Distribute Objects Vertically",
                          },
                          {
                            iconCss: "sf-diagram-icon-distribute-vertical",
                            text: "Distribute Objects Horizontally",
                          },
                        ],
                        iconCss: "e-icons e-stroke-width",
                        select: function (args) {
                          onSelectDistributeObjects(args);
                        },
                      });
                      distributeBtn.appendTo("#distributeBtn");


                      let orderBtn: any = new DropDownButton({
                        items: [
                          {
                            iconCss: "e-icons e-bring-forward",
                            text: "Bring Forward",
                          },
                          {
                            iconCss: "e-icons e-bring-to-front",
                            text: "Bring To Front",
                          },
                          {
                            iconCss: "e-icons e-send-backward",
                            text: "Send Backward",
                          },
                          {
                            iconCss: "e-icons e-send-to-back",
                            text: "Send To Back",
                          },
                        ],
                        iconCss: "e-icons e-order",
                        select: function (args) {
                          onSelectOrder(args);
                        },
                      });
                      orderBtn.appendTo("#orderBtn");


                      let rotateBtn: any = new DropDownButton({
                        items: [
                          {
                            iconCss: "e-icons e-transform-right",
                            text: "Rotate Clockwise",
                          },
                          {
                            iconCss: "e-icons e-transform-left",
                            text: "Rotate Counter-Clockwise",
                          },
                        ],
                        iconCss: "e-icons e-repeat",
                        select: function (args) {
                          onSelectRotate(args);
                        },
                      });
                      rotateBtn.appendTo("#rotateBtn");

                      let flipBtn: any = new DropDownButton({
                        items: [
                          {
                            iconCss: "e-icons e-flip-horizontal",
                            text: "Flip Horizontal",
                          },
                          {
                            iconCss: "e-icons e-flip-vertical",
                            text: "Flip Vertical",
                          },
                        ],
                        iconCss: "e-icons e-flip-horizontal",
                        select: function (args) {
                          onSelectFlip(args);
                        },
                      });
                      flipBtn.appendTo("#flipBtn");

                      refreshOverflow();
                    }
                  }}
                  clicked={toolbarClick}
                  items={toolbarItems}
                  overflowMode={"Scrollable"}
                  width={"100%"}
                ></ToolbarComponent>
              </div>
      <div className="control-section">
      
        <div style={{ width: "100%" }}>
          <div className="sb-mobile-palette-bar">
            <div
              id="palette-icon"
              style={{ float: "right" }}
              className="e-ddb-icons1 e-toggle-palette"
            ></div>
          </div>

          <div className="diagram-container">
            <div id="palette-space" className="sb-mobile-palette">
              <SymbolPaletteComponent
                id="symbolpalette"
                expandMode="Multiple"
                palettes={[
                  {
                    id: "flow",
                    expanded: true,
                    symbols: flowshapes,
                    iconCss: "e-diagram-icons1 e-diagram-flow",
                    title: "Flow Shapes",
                  },
                  {
                    id: "connectors",
                    expanded: true,
                    symbols: connectorSymbols,
                    iconCss: "e-diagram-icons1 e-diagram-connector",
                    title: "Connectors",
                  },
                ]}
                width={"100%"}
                height={"700px"}
                symbolHeight={60}
                symbolWidth={60}
                getNodeDefaults={(symbol: NodeModel): void => {
                  if (
                    symbol.id === "Terminator" ||
                    symbol.id === "Process" ||
                    symbol.id === "Delay"
                  ) {
                    symbol.width = 80;
                    symbol.height = 40;
                  } else if (
                    symbol.id === "Decision" ||
                    symbol.id === "Document" ||
                    symbol.id === "PreDefinedProcess" ||
                    symbol.id === "PaperTap" ||
                    symbol.id === "DirectData" ||
                    symbol.id === "MultiDocument" ||
                    symbol.id === "Data"
                  ) {
                    symbol.width = 50;
                    symbol.height = 40;
                  } else {
                    symbol.width = 50;
                    symbol.height = 50;
                  }
                  symbol.style.strokeColor = "#757575";
                }}
                symbolMargin={{ left: 15, right: 15, top: 15, bottom: 15 }}
                getSymbolInfo={(symbol: NodeModel): SymbolInfo => {
                  return { fit: true };
                }}
              />
            </div>

            <div className="diagram-and-toolbar-container">
              <div id="diagram-space" className="sb-mobile-diagram">
                <DiagramComponent
                  id="diagram"
                  ref={(diagram) => (diagramInstance = diagram)}
                  width={"100%"}
                  height={"700px"}
                  snapSettings={{
                    horizontalGridlines: gridlines,
                    verticalGridlines: gridlines,
                  }}
                  nodes={nodes}
                  connectors={connectors}
                  getNodeDefaults={(node: NodeModel) => {
                    if (node.width === undefined) {
                      node.width = 145;
                    }
                    node.style = { fill: "none", strokeColor: "black" };
                    for (let i: number = 0; i < node.annotations.length; i++) {
                      node.annotations[i].style = {
                        color: "black",
                        fill: "transparent",
                      };
                    }
                    //Set ports
                    node.ports = getPorts();
                    return node;
                  }} //Sets the default values of a connector
                  getConnectorDefaults={(obj: Connector) => {
                    if (obj.id.indexOf("connector") !== -1) {
                      obj.targetDecorator = {
                        shape: "Arrow",
                        width: 10,
                        height: 10,
                      };
                    }
                  }}
                  scrollChange={(args: IScrollChangeEventArgs) => {
                    if (args.panState !== "Start") {
                      let zoomCurrentValue: any = (
                        document.getElementById("btnZoomIncrement") as any
                      ).ej2_instances[0];
                      zoomCurrentValue.content =
                        Math.round(
                          diagramInstance.scrollSettings.currentZoom * 100
                        ) + " %";
                    }
                  }}
                  historyChange={(args: IHistoryChangeArgs) => {
                    historyChange(args);
                  }}
                  selectionChange={(args: ISelectionChangeEventArgs) => {
                    if (args.state === "Changed") {
                      let selectedItems = diagramInstance.selectedItems.nodes;
                      selectedItems = selectedItems.concat(
                        (diagramInstance.selectedItems as any).connectors
                      );
                      if (selectedItems.length === 0) {
                        toolbarEditor.items[6].disabled = true;
                        toolbarEditor.items[7].disabled = true;
                        toolbarEditor.items[19].disabled = true;
                        toolbarEditor.items[20].disabled = true;
                        toolbarEditor.items[25].disabled = true;
                        toolbarEditor.items[29].disabled = true;
                        toolbarEditor.items[31].disabled = true;
                        disableMultiselectedItems();
                      }
                      if (selectedItems.length === 1) {
                        enableItems();
                        disableMultiselectedItems();

                        if (
                          selectedItems[0].children !== undefined &&
                          selectedItems[0].children.length > 0
                        ) {
                          toolbarEditor.items[27].disabled = false;
                        } else {
                          toolbarEditor.items[27].disabled = true;
                        }
                      }

                      if (selectedItems.length > 1) {
                        enableItems();
                        toolbarEditor.items[22].disabled = false;
                        toolbarEditor.items[23].disabled = false;
                        toolbarEditor.items[27].disabled = false;
                        if (selectedItems.length > 2) {
                          toolbarEditor.items[23].disabled = false;
                        } else {
                          toolbarEditor.items[23].disabled = true;
                        }
                      }
                    }
                  }}
                  //Sets the Node style for DragEnter element.
                  dragEnter={(args: IDragEnterEventArgs): void => {
                    let obj: NodeModel = args.element as NodeModel;
                    if (obj instanceof Node) {
                      let oWidth: number = obj.width;
                      let oHeight: number = obj.height;
                      let ratio: number = 100 / obj.width;
                      obj.width = 100;
                      obj.height *= ratio;
                      obj.offsetX += (obj.width - oWidth) / 2;
                      obj.offsetY += (obj.height - oHeight) / 2;
                      obj.style = { fill: "#357BD2", strokeColor: "white" };
                    }
                  }}
                >
                  <Inject services={[PrintAndExport, UndoRedo]} />
                </DiagramComponent>
              </div>

              
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
export default Default;
