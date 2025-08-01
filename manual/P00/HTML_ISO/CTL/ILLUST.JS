var gESM;
var fImgDrag = false;
var basePosX, basePosY;
var offsPosX, offsPosY;
function FIC() {
    focus();
    if (typeof (parent.parent.document.ESM) == "object") {
        document.ESM = parent.parent.document.ESM;
        gESM = document.ESM;
    } else {
        gESM = new Array;
        document.ESM = gESM;
    }
    gESM.iDT = new Array;
    gESM.iNo = 0;
    with (document) {
        write("<link href=\"../CTL/ESM_DISP.CSS\" media=\"screen\" rel=\"stylesheet\">");
        write("<link href=\"../CTL/ESM_PRIN.CSS\" media=\"print\" rel=\"stylesheet\">");
    }
}
function FS4(x, y, fontSize, lineHeight, fontName, color, text) {
    var data = new Array;
    data.posX = x;
    data.posY = y;
    data.fontSize = fontSize;
    data.lineHeight = lineHeight;
    data.fontName = fontName;
    data.Color = color;
    data.Text = text;
    return (data);
}
function TagToStr(tag) {
    var c, i;
    var cQuote = "";
    var fTag = false;
    var fSpace = true;
    var strOut = "";
    for (i = 0; i < tag.length; ++i) {
        c = tag.charAt(i);
        if (cQuote != "") {
            if (c == cQuote) {
                cQuote = "";
            }
        } else if (fTag && ((c == '"') || (c == "'"))) {
            cQuote = c;
        } else if (!fTag && (c == "<")) {
            fTag = true;
        } else if (fTag && (c == ">")) {
            fTag = false;
            c = " ";
        }
        if (!fTag) {
            if (c == " ") {
                if (!fSpace) {
                    strOut += c;
                }
                fSpace = true;
            } else {
                strOut += c;
                fSpace = false;
            }
        }
    }
    return (strOut);
}
function FIL(no, data, width) {
    with (document) {
        write("<br><div>" + FIL0(no) + "</div>");
        write("<p><div id=\"FIG" + no + "\" class=\"FIGN\">");
        write(FIL1(no, data, width));
        write(FIL2(no, data, width));
        write("</div></p>");
    }
}
function FILN(no, data) {
    with (document) {
        write("<p><div id=\"FIG" + no + "\" class=\"FIG\">");
        write(FIL1(no, data, data.width));
        write(FIL2(no, data, data.width));
        write("</div></p>");
    }
}
function FILR(no, data) {
    with (document) {
        write("<div>" + FIL0(no) + "</div>");
        write("<div id=\"FIG" + no + "\" class=\"FIGN\">");
        write(FIL1R(no, data));
        write(FIL2(no, data, data.Width));
        write("</div><br clear=\"all\">");
    }
}
function FIL0(no) {
    return ("<input type='image' title='Abrir a figura' " + "src='../../PNG/CTL/ILSTSHOW.PNG' " + "onclick='FigOnOff(this, " + no + ");' " + "ondblclick='FigOnOff(this, " + no + ");'></input>");
}
function FIL1(no, data, width) {
    var ratio = width / data.Width;
    var strClick = "ZoomOpen(gESM.iDT[" + (no - 1) + "]);";
    var strBuf = "";
    if (isNaN(ratio)) {
        ratio = 1.0;
    }
    strBuf += "<img id='GRF" + no + "' " + "style='position:relative;top:0;left:0;' " + "src='../../PNG/" + data.Name + ".PNG' " + "width='" + Math.floor(data.Width * ratio) + "px' " + "height='" + Math.floor(data.Height * ratio) + "px' " + "title='Zoom figure' " + "onclick='" + strClick + "' ondblclick='" + strClick + "'>";
    return (strBuf);
}
function FIL1R(no, data) {
    var strClick = "ZoomOpen(gESM.iDT[" + (no - 1) + "]);";
    var strBuf;
    strBuf = "<img id=\"GRF" + no + "\" " + "style=\"position:relative;top:0;left:0;\" " + "src=\"../../PNG/" + data.Name + ".PNG\" " + "width=\"100%\" title=\"Figura do zoom\" " + "onclick=\"" + strClick + "\" ondblclick=\"" + strClick + "\" " + "onresize=\"ResizeFig(" + no + ");\">";
    return (strBuf);
}
function FIL2(no, data, width) {
    var i;
    var ratio = width / data.Width;
    var strBuf = "";
    var strID = "CallOut" + no + "_";
    if (isNaN(ratio)) {
        ratio = 1.0;
    }
    for (i = 0; i < data.CallOut.length; ++i) {
        with (data.CallOut[i]) {
            if (Color == 2) {
                strBuf += "<img id=\"" + strID + i + "\" src=\"" + Text + "\" " + "style=\"position:absolute;top:" + Math.floor(posY * ratio) + ";left:" + Math.floor(posX * ratio) + ";\" " + "title=\"" + TagToStr(fontName) + "\" " + "height=\"" + Math.floor(fontSize * ratio) + "px\" " + "type=\"image/bmp\">";
            } else {
                strBuf += "<span id=\"" + strID + i + "\" " + "style=\"font-size:" + Math.floor(fontSize * ratio) + "px;" + "position:absolute;" + "top:" + Math.floor(posY * ratio) + "px;" + "left:" + Math.floor(posX * ratio) + "px;\" " + "title=\"" + TagToStr(Text) + "\">";
                strBuf += "<nobr><span style=\"font-family:" + fontName + ";";
                if (Color == 1) {
                    strBuf += "color:white;";
                }
                strBuf += "\">" + Text + "</span></nobr></span>";
            }
        }
    }
    return (strBuf);
}
function ResizeFig(no) {
    var objBlk = document.all["FIG" + no];
    var objImg = document.all["GRF" + no];
    var data = gESM.iDT[no - 1];
    var ratio;
    if (objBlk.className == "FIGN") {
        return;
    }
    ratio = objImg.height / data.Height;
    ResizeExec(no, data, ratio);
}
function ResizeExec(no, data, ratio) {
    var i, lineH;
    for (i = 0; i < data.CallOut.length; ++i) {
        with (document.all["CallOut" + no + "_" + i].style) {
            lineH = data.CallOut[i].lineHeight + data.CallOut[i].fontSize;
            if (data.CallOut[i].lineHeight < 0) {
                lineH += Math.floor(data.CallOut[i].fontSize * 0.4);
            }
            left = Math.floor(data.CallOut[i].posX * ratio);
            top = Math.floor(data.CallOut[i].posY * ratio);
            if (data.CallOut[i].Color == 2) {
                height = Math.floor(data.CallOut[i].fontSize * ratio);
            } else {
                fontSize = Math.floor(data.CallOut[i].fontSize * ratio);
            }
            lineHeight = Math.floor(lineH * ratio) + "px";
        }
    }
}
function FigOnOff(my, no) {
    var data = gESM.iDT[no - 1];
    var strID = "FIG" + no;
    event.cancelBubble = true;
    with (document.all[strID]) {
        if (className == "FIGN") {
            className = "FIG";
            my.title = "Fechar a figura";
        } else {
            className = "FIGN";
            my.title = "Abrir a figura";
        }
    }
}
function ZoomOpen(data) {
    console.log("zoomOpen", data)
    with (document) {
        ESM.COut = data;
        ESM.figWnd = window.open("../CTL/IMGFRAME.HTML", "_blank");
    }
}
function OnUnloadContents() {
    with (document) {
        if (typeof (ESM.figWnd) != "undefined") {
            if (typeof (ESM.figWnd.closed) != "undefined") {
                if (!ESM.figWnd.closed) {
                    ESM.figWnd.close();
                }
            }
        }
    }
}
function OnDragStart() {
    if (event.button != 1) {
        OnDragEnd();
        return (true);
    }
    if ((event.x > bodyMain.clientWidth) || (event.y > bodyMain.clientHeight)) {
        return;
    }
    basePosX = event.x;
    basePosY = event.y;
    offsPosX = bodyMain.scrollLeft;
    offsPosY = bodyMain.scrollTop;
    fImgDrag = true;
    event.returnValue = false;
}
function OnDragEnd() {
    var posX, posY;
    if (fImgDrag) {
        bodyMain.scrollLeft = (basePosX - event.clientX) + offsPosX;
        bodyMain.scrollTop = (basePosY - event.clientY) + offsPosY;
        event.returnValue = false;
    }
    fImgDrag = false;
}
function OnDragMove() {
    var posX, posY;
    if (event.button != 1) {
        if (fImgDrag) {
            OnDragEnd();
        }
    } else {
        bodyMain.scrollLeft = (basePosX - event.clientX) + offsPosX;
        bodyMain.scrollTop = (basePosY - event.clientY) + offsPosY;
        event.returnValue = false;
    }
}
