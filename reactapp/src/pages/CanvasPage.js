import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header/Header.js";
import { useSelector, useDispatch } from "react-redux";
import { fabric } from "fabric";

import Styles from "./CanvasPage.css";
import Fonts from "./Fonts.css";

import CanvasButton from "../components/CanvasButton/CanvasButton.js";
import UploadButton from "../components/UploadButton/UploadButton.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faTextHeight,
  faCloudUploadAlt,
  faShapes,
  faFont,
  faChevronDown,
  faUndoAlt,
  faBook,
  faSave,
  faTrashAlt,
  faPlusCircle,
  faCropAlt,
  faAdjust,
} from "@fortawesome/free-solid-svg-icons";
import {
  setCanvas,
  setObjectsState,
  showBottomSlide,
  hideBottomSlide,
  setUpdatePanelState,
} from "../actions";
import { A } from "hookrouter";
import { useAlert } from "react-alert";
var FontFaceObserver = require("fontfaceobserver");


const BACKEND_URL = "http://127.0.0.1:8000";
let canvas = null, canvas_display = null, bottomNav = false, scalePropsVal, displayContainerDimensions, filtersArray = [];

const CanvasPage = (props) => {
  const dispatch = useDispatch();
  const [bookName, setBookName] = useState("");
  const [filterVal, setFilterVal] = useState(0);
  const [activePage, setActivePage] = useState();
  const [images, setImages] = useState([]);

  const alert = useAlert();

  const isSideNavActive = useSelector((state) => state.isSideNavActive);
  const backgrounds = useSelector((state) => state.backgrounds);
  const shapes = useSelector((state) => state.shapes);
  const all_text = useSelector((state) => state.text);
  const fonts = useSelector((state) => state.fonts);
  const updatePanelState = useSelector((state) => state.updatePanelState);
  const objectStates = useSelector((state) => state.objectStates);

  const canvasContainer = useRef(null);
  const canvasDisplayContainer = useRef(null);
  const { id } = props;
  var styles = {
    body: {
      overflow: "hidden",
      height: "100vh",
      width: "100vw",
    },
  };

  useEffect(() => {
    for (var i in styles.body) {
      document.body.style[i] = styles.body[i];
    }

    const containerDimensions = canvasContainer.current.getBoundingClientRect();
    scalePropsVal = getObjectDimensions(containerDimensions)

    displayContainerDimensions =
      canvasDisplayContainer.current.getBoundingClientRect();

    canvas = new fabric.Canvas("canvas", {
      height: containerDimensions.height - 150,
      width: containerDimensions.width - 30,
      backgroundColor: "#fff",
      selection: false,
    });

    canvas_display = new fabric.Canvas("canvas_display", {
      height: containerDimensions.height - 600,
      width: containerDimensions.width - 200,
      backgroundColor: "#fff",
      selection: false,
    });

    canvasUpdateControls();

    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "#333333",
      borderSize: 5,
      cornerColor: "#333333",
      cornerSize: 16,
      cornerStyle: "circle",
      cornerColor: "#333333",
      padding: 10,
    });

    fabric.Object.prototype.setControlsVisibility({
      tl: true, //top-left
      mt: false, // middle-top
      tr: true, //top-right
      ml: false, //middle-left
      mr: false, //middle-right
      bl: true, // bottom-left
      mb: false, //middle-bottom
      br: true, //bottom-right
      mtr: true, // rotate icon
    });

    // canvas events
    canvas.on("selection:created", function (e) {
      const obj = e.target;
      updateObjectsStates(obj);
      updateObjectProps(obj);
    });
    canvas.on("selection:updated", function (e) {
      const obj = e.target;
      updateObjectsStates(obj);
      updateObjectProps(obj);
    });
    canvas.on("selection:cleared", function (e) {
      const obj = e.target;
      updateObjectsStates({ name: "clear" });
    });

    fetch(`${BACKEND_URL}/api/book/${id.id}/page/${id.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setActivePage(res);
        canvas.loadFromJSON(res.canvas, function () {
          canvas.renderAll();
          dispatch(setCanvas(canvas));
          loadImages(res)
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const loadImages = (page) =>{
    fetch(`${BACKEND_URL}/api/book/images/${id.id}/`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setImages(res);
      })
      .catch((err) => console.log(err));
  }

  const getObjectDimensions = (containerDimensions) => {
    let fontWeight = 500
    let perctangeWidth = (5 / 100) * containerDimensions.width
    let perctangeHeight = (5 / 100) * containerDimensions.height

    if(containerDimensions.width < 700){ 
        fontWeight = 400
    }
    if(containerDimensions.width < 500){
        fontWeight = 300
    }
    
    return {
        height: perctangeHeight,
        width: perctangeWidth,
        strokeWidth: perctangeWidth / 14,
        fontWeight: fontWeight,
        lineHeight: perctangeHeight * 2,
        lineSelectorHeight: perctangeHeight * .75,
    }
  }

  const updateObjectProps = (object) => {};

  const updateObjectsStates = (object) => {
    let obj;
    switch (object.name) {
      case "text":
        obj = {
          activeObject: true,
          text: true,
          shape: false,
          image: false,
        };
        break;
      case "shape":
        obj = {
          activeObject: true,
          text: false,
          shape: true,
          image: false,
        };
        break;
      case "image":
        obj = {
          activeObject: true,
          text: false,
          shape: false,
          image: true,
        };
        break;
      case "clear":
        obj = {
          activeObject: false,
          text: false,
          shape: false,
          image: false,
        };
        break;
    }
    dispatch(setObjectsState(obj));
  };

  const updateImageFilter = (e) => {
    setFilterVal(e.target.value);
    switch (updatePanelState) {
      case "brightness":
        if (filtersArray.includes(updatePanelState)) {
          applyFilterValue(0, "brightness", parseFloat(e.target.value));
          filtersArray.push(updatePanelState);
        } else {
          applyFilter(
            0,
            new fabric.Image.filters.Brightness({
              brightness: parseFloat(e.target.value),
            })
          );
        }
        break;
      case "saturation":
        if (filtersArray.includes(updatePanelState)) {
          applyFilterValue(1, "saturation", parseFloat(e.target.value));
          filtersArray.push(updatePanelState);
        } else {
          applyFilter(
            1,
            new fabric.Image.filters.Saturation({
              saturation: parseFloat(e.target.value),
            })
          );
        }
        break;
      case "contrast":
        if (filtersArray.includes(updatePanelState)) {
          applyFilterValue(2, "contrast", parseFloat(e.target.value));
          filtersArray.push(updatePanelState);
        } else {
          applyFilter(
            2,
            new fabric.Image.filters.Contrast({
              contrast: parseFloat(e.target.value),
            })
          );
        }
        break;
      case "blur":
        if (filtersArray.includes(updatePanelState)) {
          applyFilterValue(3, "blur", parseFloat(e.target.value));
          filtersArray.push(updatePanelState);
        } else {
          applyFilter(
            3,
            new fabric.Image.filters.Blur({
              blur: parseFloat(e.target.value),
            })
          );
        }
        break;
    }
  };

  const getFilter = (obj, type) => {
    var filter_val = null;
    if (obj.filters.length > 0) {
      for (var i = 0; i < obj.filters.length; i++) {
        const filter = obj.filters[i];
        if (filter.type.toUpperCase() == type.toUpperCase()) {
          filter_val = filter;
          break;
        }
      }
    }

    if (filter_val) {
      return filter_val[type];
    } else {
      return 0;
    }
  };

  const applyFilter = (index, filter) => {
    var obj = canvas_display._objects[0];
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas_display.renderAll();
  };

  const applyFilterValue = (index, prop, value) => {
    var obj = canvas_display._objects[0];
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      obj.applyFilters();
      canvas_display.renderAll();
    }
  };

  const saveFilters = () => {
    const obj = canvas.getActiveObject();
    const filters = canvas_display._objects[0].filters;
    obj.filters = filters;
    obj.applyFilters();
    canvas.renderAll();
    dispatch(hideBottomSlide());
  };

  const resetFilters = () => {
    setFilterVal(0);
    const obj_main = canvas.getActiveObject();
    const obj = canvas_display._objects[0];
    obj.filters = [];
    obj_main.filters = [];

    obj.applyFilters();
    obj_main.applyFilters();
    canvas_display.renderAll();
    canvas.renderAll();
  };

  const updatePanelStateVal = (type) => {
    dispatch(setUpdatePanelState(type));
    setFilterVal(getFilter(canvas_display._objects[0], type));
  };

  const adjustPanel = () => {
    displayContainerDimensions = {
      width: window.innerWidth * 0.7,
      height: window.innerWidth * 0.7,
    };
    canvas_display.clear();
    canvas.getActiveObject().clone(function (clonedObj) {
      clonedObj.set({
        left: 0,
        top: 0,
        evented: true,
        hasControls: false,
        height: displayContainerDimensions.height,
        width: displayContainerDimensions.width,
        selectable: false,
        scaleX: 1,
        scaleY: 1,
      });
      setFilterVal(getFilter(clonedObj, updatePanelState));
      canvas_display.setDimensions({
        width: displayContainerDimensions.width,
        height: displayContainerDimensions.height,
      });
      // clonedObj.scaleToHeight(displayContainerDimensions.width)
      canvas_display.add(clonedObj);
      canvas_display.renderAll();
    });
    dispatch(showBottomSlide("update-container"));
  };

  const canvasUpdateControls = () => {
    var rotateIcon =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAhQAAAIUB4uz/wQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHhSURBVEiJrdWxalRBFAbgb8IiqQXXImxKNXabaEAQfABJkVYhr2CpzRrzAMpaWVmksPMNUqVJEVdMY3wBEaKgENDgahyLOzfOvXuXZM0eOMzlzsz//+fMOTMhxmichRDauIkbWEpjwF7yd9iJMX4cCxJjHHG00MMQ8RT/iSe40IjVAL6A3TFgB8mb5vZxG91EGEYIsIajbNMQfayik62bwwpe4Dhb/wff0/fVCkFSnoO/x2JT2DVRy+k86hHdPyFIOc/TsonZ08Azkm7DeT3LCXo15WcGT/u3GiLYLiu0nbEPz5KWBoJ5bCRxJcFhSXA3+9mfFLyB7Doe43lJsJ4RrJ6XoO4tRYeWNjAFCyG8xDW8gk9J/cG0VONDwvw1g0uJ+Os01Ce7mMYvM3iAneTnthBCR1GZMJjqgab0rPpXNOutxNpXpOh1jHH/nEHcyb4HFPf7oWonb2D+P9QvqjZtu5zYNtrqWxOCz6p2ci+/i57WwIfoTgi+me3fRSsnuNcQwR6Wz5iWXPkRFk7m06IrafIbfmeLjxWPygrmMtCOolr6qtf0EdYqAtKGgEeKR2dJ8ZhP+mTu5sorBA1ht/AQP8aA1c+rV+a87iEBNloI4TJupTyXTlHfb9P4Jsb4eRzGXx2eQxOG+L0nAAAAAElFTkSuQmCC";
    var img = document.createElement("img");
    img.src = rotateIcon;
    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.55,
      offsetY: -20,
      cursorStyle: "pointer",
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      actionName: "rotate",
      render: renderIcon(img),
      cornerSize: 26,
      withConnection: false,
    });

    function renderIcon(icon) {
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size + 2, size);
        ctx.restore();
      };
    }

    // enable text editing on full screen mode
    const _original_initHiddenTextarea =
      fabric.IText.prototype.initHiddenTextarea;
    fabric.util.object.extend(
      fabric.IText.prototype,
      /** @lends fabric.IText.prototype */ {
        //fix for : IText not editable when canvas is in a fullscreen element on chrome
        // https://github.com/fabricjs/fabric.js/issues/5126
        initHiddenTextarea: function () {
          _original_initHiddenTextarea.call(this);
          this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
        },
      }
    );
  };

  const toggleBottomNav = (e) => {
    if (bottomNav) {
      document.querySelector(".bottom-nav").classList.remove("active");
      bottomNav = false;
    } else {
      document.querySelector(".bottom-nav").classList.add("active");
      bottomNav = true;
    }
  };

  const slideClick = (e) => {
    if (e.target.classList.contains("bottom-slide-container")) {
      dispatch(hideBottomSlide());
    }
  };

  // Add text
  const addText = (props) => {
    var uuid = require("uuid");
    var id = uuid.v4();
    let text = new fabric.IText(props.text, {
      left: 100,
      top: 100,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      id: id,
      name: "text",
      fontFamily: props.fontFamily,
    });
    canvas.add(text);
    dispatch(hideBottomSlide());
  };

  // Delete Object
  const deleteObject = (props) => {
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
    }
  };

  const undoCanvas = () => {
    canvas.undo();
  };

  const uploadImage = (cover) => {
    const formData = new FormData()
    formData.append('image', cover, cover.name)
    formData.append('page', activePage.id)

    fetch(`${BACKEND_URL}/api/book/upload/${id.id}/`, {
      method:"POST",
      body:formData
    })
      .then((res) => res.json())
      .then((res) => {
        setImages([...images, res]);
      })
      .catch((err) => console.log(err));

    };

  const saveCanvas = () => {
    fetch(`${BACKEND_URL}/api/book/${id.id}/page/${id.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        canvas: JSON.stringify(
          canvas.toJSON([
            "hasControls",
            "hasBorders",
            "selectable",
            "id",
            "class",
            "name",
            "ref_id",
            "shapeType",
          ])
        ),
        image: canvas.toDataURL(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        alert.show("Canvas saved!", {
          type: "success",
        });
      })
      .catch((err) => console.log(err));
  };

  // Duplicate Object
  const duplicateObject = (props) => {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.clone(
        function (clonedObj) {
          clonedObj.set({
            left: clonedObj.left + 30,
            top: clonedObj.top + 10,
            evented: true,
          });
          canvas.add(clonedObj);
          canvas.setActiveObject(clonedObj);
          canvas.renderAll();
        },
        [
          "hasControls",
          "hasBorders",
          "selectable",
          "id",
          "class",
          "name",
          "ref_id",
          "shapeType",
        ]
      );
    }
  };

  // Flip Object
  const flipObject = (props) => {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set("flipX", !obj["flipX"]);
      canvas.renderAll();
    }
  };

  // Set font
  const setFont = (props) => {
    const obj = canvas.getActiveObject();
    if (obj) {
      var myfont = new FontFaceObserver(props.fontFamily);
      myfont
        .load()
        .then(function () {
          // when font is loaded, use it.
          obj.set("fontFamily", props.fontFamily);
          canvas.requestRenderAll();
        })
        .catch(function (e) {
          console.log(e);
        });
    }
  };

  // Add background
  const canvasSetBackground = (props) => {
    fabric.Image.fromURL(props.src, function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
    });

    dispatch(hideBottomSlide());
  };

  // generating star points
  const starPolygonPoints = (spikeCount, outerRadius, innerRadius) => {
    var rot = (Math.PI / 2) * 3;
    var cx = outerRadius;
    var cy = outerRadius;
    var sweep = Math.PI / spikeCount;
    var points = [];
    var angle = 0;

    for (var i = 0; i < spikeCount; i++) {
      var x = cx + Math.cos(angle) * outerRadius;
      var y = cy + Math.sin(angle) * outerRadius;
      points.push({ x: x, y: y });
      angle += sweep;

      x = cx + Math.cos(angle) * innerRadius;
      y = cy + Math.sin(angle) * innerRadius;
      points.push({ x: x, y: y });
      angle += sweep;
    }
    return points;
  };

  const regularPolygonPoints = (sideCount, radius) => {
    var sweep = (Math.PI * 2) / sideCount;
    var cx = radius;
    var cy = radius;
    var points = [];
    for (var i = 0; i < sideCount; i++) {
      var x = cx + radius * Math.cos(i * sweep);
      var y = cy + radius * Math.sin(i * sweep);
      points.push({ x: x, y: y });
    }
    return points;
  };

  // Add shape
  const addShape = (props) => {
    var uuid = require("uuid");
    var id = uuid.v4();
    let shape;
    switch (props.name) {
      case "circle":
        shape = new fabric.Circle({
          name: "shape",
          radius: 50,
          left: 200,
          top: 200,
          originX: "center",
          originY: "center",
          fill: "#589edb",
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          name: "shape",
          width: 200,
          height: 100,
          originX: "center",
          originY: "center",
          left: 200,
          top: 200,
          fill: "#589edb",
          transparentCorners: false,
          strokeUniform: true,
          padding: 10,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          name: "shape",
          width: 100,
          height: 100,
          originX: "center",
          originY: "center",
          left: 200,
          top: 200,
          fill: "#589edb",
        });
        break;
      case "star":
        const pointsStar = starPolygonPoints(5, 50, 25);
        shape = new fabric.Polygon(
          pointsStar,
          {
            name: "shape",
            originX: "center",
            originY: "center",
            left: 200,
            top: 200,
            fill: "#589edb",
          },
          false
        );
        break;
      case "polygon":
        const pointsPolygon = regularPolygonPoints(6, 30);
        shape = new fabric.Polygon(
          pointsPolygon,
          {
            name: "shape",
            originX: "center",
            originY: "center",
            left: 200,
            top: 200,
            height: 100,
            width: 100,
            fill: "#589edb",
          },
          false
        );
        break;
      default:
        shape = new fabric.Triangle({
          name: "shape",
          width: 100,
          height: 100,
          originX: "center",
          originY: "center",
          left: 200,
          top: 200,
          fill: "#589edb",
          transparentCorners: false,
          strokeUniform: true,
        });
        break;
    }
    shape.scaleToHeight(scalePropsVal.height * 4);
    canvas.add(shape);
    canvas.renderAll();
    dispatch(hideBottomSlide());
  };

  // Add image
  const addImage = (src) => {
    var uuid = require("uuid");
    var id = uuid.v4();
    let img = new Image();
    img.onload = function () {
      let imgInstance = new fabric.Image(img, {
        id: id,
        left: 100,
        top: 100,
        name: "image",
      });
      imgInstance.scaleToHeight(scalePropsVal.height * 4);
      canvas.add(imgInstance);
    };
    img.src = src;
  };

  return (
    <>
      <Header title={activePage ? activePage.title : ""} />

      <div className="container page-padding">
        <div className="canvas-box" ref={canvasContainer}>
          <canvas id="canvas" />
          <div className="canvas-buttons">
            <CanvasButton
              icon={faCloudUploadAlt}
              text="Uploads"
              id="upload_button"
            />
            <CanvasButton
              icon={faLayerGroup}
              text="Backgrounds"
              id="background_button"
            />
            <CanvasButton icon={faTextHeight} text="Text" id="text_button" />
            <CanvasButton icon={faShapes} text="Shapes" id="shapes_button" />
          </div>
        </div>
        <div className="bottom-nav">
          <span className="ham-circle" onClick={toggleBottomNav}>
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
          <div className="nav-buttons">
          <A href={`/books`}>
            <div className="nav-button">
              <FontAwesomeIcon icon={faBook} />
              <span>
                Books
              </span>
            </div>
            </A>
            <div className="nav-button" onClick={saveCanvas}>
              <FontAwesomeIcon icon={faSave} />
              <span>Save</span>
            </div>
            <div className="nav-button" onClick={undoCanvas}>
              <FontAwesomeIcon icon={faUndoAlt} />
              <span>Undo</span>
            </div>
          </div>
        </div>

        <div className={`sidenav ${objectStates.activeObject ? "" : "d_none"}`}>
          <div
            className={`sidenav-container sidenav-object-container ${
              objectStates.activeObject ? "" : "d_none"
            }`}
          >
            <div
              className={`nav-button nav-button--secondary ${
                objectStates.text ? "" : "d_none"
              }`}
              onClick={() => dispatch(showBottomSlide("fonts-container"))}
            >
              <FontAwesomeIcon icon={faFont} />
              <span>Font</span>
            </div>
            <div
              className={`nav-button nav-button--secondary ${
                objectStates.activeObject ? "" : "d_none"
              }`}
              onClick={duplicateObject}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>Duplicate</span>
            </div>
            <div
              className={`nav-button nav-button--secondary ${
                objectStates.image || objectStates.object ? "" : "d_none"
              }`}
              onClick={flipObject}
            >
              <FontAwesomeIcon icon={faUndoAlt} />
              <span>Flip</span>
            </div>
            <div
              className={`nav-button nav-button--secondary ${
                objectStates.image ? "" : "d_none"
              }`}
              onClick={() => adjustPanel()}
            >
              <FontAwesomeIcon icon={faAdjust} />
              <span>Adjust</span>
            </div>
            <div
              className={`nav-button nav-button--secondary ${
                objectStates.activeObject ? "" : "d_none"
              }`}
              onClick={deleteObject}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              <span>Delete</span>
            </div>
          </div>
        </div>
        <div className="bottom-slide-container" onClick={slideClick}>
          <div className="bottom-slide">
            <div className="container page-padding">
              <div className="bottom-slide-tools upload-container">
                <UploadButton
                  text={"Upload Image"}
                  name="upload_file"
                  type="file"
                  uploadImage={uploadImage}
                />
                <br/>

                  <div className="upload-img-container">
                  {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => addImage(BACKEND_URL + img.image)}
                  >
                    <img src={BACKEND_URL + img.image} />
                  </div>
                ))}
                  </div>
              </div>
              <div className="bottom-slide-tools fonts-container">
                <h3 className="text-white">
                  Click to change font family of the text
                </h3>
                {fonts.map((font) => (
                  <div
                    key={font.id}
                    className={"text-element " + font.name}
                    onClick={() => setFont(font)}
                  >
                    <span style={{ fontFamily: font.fontFamily }}>
                      {font.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bottom-slide-tools update-container">
                <div
                  class="canvas-display-container"
                  ref={canvasDisplayContainer}
                >
                  <canvas id="canvas_display"></canvas>
                </div>
                <div class="update-panel">
                  <div class="range-container">
                    <span className="range-display">
                      {parseFloat(filterVal).toFixed(2)}
                    </span>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.003921"
                      value={filterVal}
                      onChange={updateImageFilter}
                    />
                  </div>
                  <h4
                    style={{ color: "#fff" }}
                    className="state-heading text-capitalize"
                  >
                    {updatePanelState}
                  </h4>
                  <div className="update-panel-container">
                    <div
                      onClick={() => updatePanelStateVal("brightness")}
                      className="brightness active"
                    >
                      <img src="http://localhost:3000/static/images/icons/brightness.svg" />
                    </div>
                    <div
                      onClick={() => updatePanelStateVal("contrast")}
                      className="contrast"
                    >
                      <img src="http://localhost:3000/static/images/icons/contrast.svg" />
                    </div>
                    <div
                      onClick={() => updatePanelStateVal("saturation")}
                      className="saturation"
                    >
                      <img src="http://localhost:3000/static/images/icons/saturation.svg" />
                    </div>
                    <div
                      onClick={() => updatePanelStateVal("blur")}
                      className="blur"
                    >
                      <img src="http://localhost:3000/static/images/icons/blur.svg" />
                    </div>
                  </div>
                </div>
                <div className="button-container">
                  <button class="btn btn-primary" onClick={saveFilters}>
                    Save
                  </button>
                  <button
                    class="btn btn-trasparent btn-block"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="bottom-slide-tools background-container img-container">
                {backgrounds.map((background) => (
                  <div
                    key={background.id}
                    onClick={() => canvasSetBackground(background)}
                  >
                    <img src={background.src} alt={background.name} />
                  </div>
                ))}
              </div>
              <div className="bottom-slide-tools text-container">
                <h3 className="text-white">Click to add text to add to page</h3>
                {all_text.map((text) => (
                  <div
                    key={text.id}
                    className={"text-element " + text.type}
                    onClick={() => addText(text)}
                  >
                    <span>{text.text}</span>
                  </div>
                ))}
              </div>
              <div className="bottom-slide-tools shapes-container img-container">
                {shapes.map((shape) => (
                  <div key={shape.id} onClick={() => addShape(shape)}>
                    <img src={shape.src} alt={shape.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasPage;
