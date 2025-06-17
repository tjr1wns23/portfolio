// 인원제한
var maxuser = 15;
var linewidth = 80;
var svgHeight = 500;
var gridline = [];
var resultline = [];
var resultobj = { "user": 0, "list": [], "line": [] };
let btnColor = [];
let isSet = false;
let randomXArray = [];
let ladderSpeed = 4; // 기본 속도 1

function numberCheck() {
  document.getElementById("resultuser").innerHTML = "";
  isSet = false;
  btnColor = [];
  gridline = [];
  resultline = [];
  resultobj = { "user": 0, "list": [], "line": [] };
  var num = document.getElementById("num").value;
  if (num == undefined || num == "" || !Number(num)) {
    num = 0;
  }
  if (num <= 1) {
    alert("참여인원을 입력하세요.(최소 2명입니다.)");
    document.getElementById("num").value = "";
    document.getElementById("num").focus();
    return;
  }
  if (num > maxuser) {
    alert("참여인원은 최대 " + maxuser + "명입니다");
    document.getElementById("num").value = "";
    document.getElementById("num").focus();
    return;
  }
  resultobj.user = num;
  var html = [];
  for (var i = 0; i < num; i++) {
    // 랜덤컬러
    let rndcolor = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    btnColor.push(rndcolor);
    html.push("<li><input type=\"text\" id='name" + (i + 1) + "' style=\"background: " + rndcolor + "\" name=\"lname\" placeholder=\"이름" + (i + 1) + "\" onmouseover=\"LineResult(" + i + ")\" onmouseout=\"LineResultView()\"/></li>");
  }
  document.getElementById("ladderheader").innerHTML = html.join('');

  var html = [];
  for (var i = 0; i < num; i++) {
    html.push("<li><input type=\"text\" name=\"litem\" placeholder=\"상품" + (i + 1) + "\"/></li>");
  }
  document.getElementById("ladderfooter").innerHTML = html.join('');
  document.getElementById("resultuser").innerHTML = "";

  var svgw = (num * linewidth);

  document.getElementById("ladderboder").style.width = (num * linewidth) + "px";
  document.getElementById("ladderboder").style.height = svgHeight + "px";
  document.getElementById("ladderresult").style.width = (num * linewidth) + "px";
  document.getElementById("ladderresult").style.height = svgHeight + "px";
  document.getElementById("ladderresult").style.display = "none";

  var svg = [];
  svg.push("<svg id=\"laddersvg\" width=\"" + svgw + "\" height=\"" + svgHeight + "\">");
  for (var i = 0; i < num; i++) {
    var x = ((linewidth / 2) + (i * linewidth));
    svg.push("<line x1=\"" + x + "\" y1=\"0\" x2=\"" + x + "\" y2=\"" + svgHeight + "\" stroke=\"#000\" stroke-width=\"1\"/>");
  }
  svg.push("</svg>");
  var lb = document.getElementById("ladderboder");
  lb.innerHTML = svg.join('');
  var l = document.querySelectorAll("#div1 > ul > li");
  l.forEach(function (el) {
    el.style.width = linewidth + "px";
  })
}

function showResult() {
  var ladderresult = document.getElementById("ladderresult");
  ladderresult.style.display = "inline-block";
  var rline = [];


  for (var i = 0; i < gridline.length; i++) {
    var ix = (gridline[i].x - 40) / linewidth;
    rline.push({ "x1": gridline[i].x, "x2": gridline[i].x + linewidth, "y": gridline[i].y });
    rline.push({ "x1": gridline[i].x + linewidth, "x2": gridline[i].x, "y": gridline[i].y });
  }

  for (var i = 0; i < resultobj.user; i++) {
    var x = ((linewidth / 2) + (i * linewidth));
    //                    rline.push({ "x1": x, "x2": x, "y": 0 });
    rline.push({ "x1": x, "x2": x, "y": svgHeight });
  }

  rline.sort(function (a, b) {
    return a["y"] - b["y"];
  });

  var svg = [];
  svg.push("<svg id=\"ladderresultsvg\" width=\"100%\" height=\"100%\">");

  for (var i = 0; i < resultobj.user; i++) {
    var lcolor = btnColor[i % btnColor.length];
    var resultusr = document.getElementsByName("lname")[i].value;
    if (resultusr == "") {
      resultusr = document.getElementsByName("lname")[i].getAttribute("placeholder");
    }
    console.log(lcolor);
    var linelist = [];
    var bx = (i * linewidth) + (linewidth / 2);
    var by = 0;
    linelist.push({ "x": bx, "y": by });
    for (var j = 0; j < rline.length; j++) {
      if (rline[j].x1 == bx && by > rline[j].y - 1) {
        linelist.push({ "x": bx, "y": by });
        linelist.push({ "x": rline[j].x2, "y": rline[j].y });
        svg.push("<line x1=\"" + bx + "\" y1=\"" + rline[j].y + "\" x2=\"" + rline[j].x2 + "\" y2=\"" + rline[j].y + "\" stroke=\"" + lcolor + "\" stroke-width=\"1\" data-line=\"" + i + "\"/>");
        bx = rline[j].x2;
      } else if (rline[j].x2 == bx && by > rline[j].y - 1) {
        linelist.push({ "x": bx, "y": by });
        linelist.push({ "x": rline[j].x1, "y": rline[j].y });
        svg.push("<line x1=\"" + rline[j].x1 + "\" y1=\"" + rline[j].y + "\" x2=\"" + bx + "\" y2=\"" + rline[j].y + "\" stroke=\"" + lcolor + "\" stroke-width=\"1\" data-line=\"" + i + "\"/>");
        bx = rline[j].x1;
      }
      by = rline[j].y;
    }
    linelist.push({ "x": bx, "y": svgHeight });

    var ix = (bx - 40) / linewidth;
    document.getElementsByName("litem")[ix].style.borderColor = btnColor[i];
    document.getElementsByName("litem")[ix].setAttribute("onmouseover", "LineResult(" + i + ");");
    document.getElementsByName("litem")[ix].setAttribute("onmouseout", "LineResultView();");

    var itemresult = document.getElementsByName("litem")[ix].value;
    if (itemresult == "") {
      itemresult = document.getElementsByName("litem")[ix].getAttribute("placeholder");
    }

    var html = [];
    html.push("<p style=\"color:" + btnColor[i] + "\">" + resultusr + " → " + itemresult + "</p>");
    resultuser.innerHTML += html.join('');

    var bx = 0;
    var by = 0;
    for (var j = 0; j < linelist.length; j++) {
      if (j % 2 == 0) {
        svg.push("<line x1=\"" + linelist[j].x + "\" y1=\"" + linelist[j].y + "\" ");
        bx = linelist[j].x;
        by = linelist[j].y;
      } else {
        svg.push(" x2=\"" + linelist[j].x + "\" y2=\"" + linelist[j].y + "\" stroke=\"" + lcolor + "\" stroke-width=\"1\" data-line=\"" + i + "\"/>");
      }

    }
  }
  svg.push("</svg>");
  ladderresult.innerHTML = svg.join('');
}

function XYSetting(e) {
  var lb = document.getElementById("ladderboder");
  var svgtop = lb.getBoundingClientRect().top;
  var x = Math.floor((e.pageX + (linewidth / 2)) / linewidth) * linewidth - (linewidth / 2);
  var y = e.pageY - svgtop;
  if (x > 0 && x < document.getElementById("laddersvg").clientWidth - (linewidth / 2)) {
    var check = false;
    var cli = 0;
    for (var i = 0; i < gridline.length; i++) {
      if (Number(gridline[i].x) == Number(x) && Number(gridline[i].y) == Number(y)) {
        check = true;
        cli = i;
      }
    }
    if (check) {
      gridline.splice(cli, 1);
    } else {
      var chk = false;
      for (var i = 0; i < gridline.length; i++) {

        if (gridline[i].y == y) {
          chk = true;
        }
      }
      if (!chk) {
        gridline.push({ "x": x, "y": y });
      }
    }

    var addsvg = [];
    addsvg.push("<svg id=\"laddersvg\" width=\"" + lb.clientWidth + "\" height=\"" + svgHeight + "\">");
    var num = (lb.clientWidth / linewidth);
    // 기본라인
    for (var i = 0; i < num; i++) {
      var x = ((linewidth / 2) + (i * linewidth));
      addsvg.push("<line x1=\"" + x + "\" y1=\"0\" x2=\"" + x + "\" y2=\"" + svgHeight + "\" stroke=\"#000\" stroke-width=\"1\"/>")
    }
    for (var i = 0; i < gridline.length; i++) {
      var sx = (gridline[i].x);
      var sy = gridline[i].y;
      addsvg.push("<line x1=\"" + sx + "\" y1=\"" + sy + "\" x2=\"" + (sx + linewidth) + "\" y2=\"" + sy + "\" stroke=\"#000\" stroke-width=\"1\"/>")
    }
    addsvg.push("</svg>");
    var lbs = document.getElementById("ladderboder");
    lbs.innerHTML = addsvg.join('');
  }
}

function LineResult(no) {
  if (document.getElementById("ladderresultsvg") != undefined)
    document.getElementById("ladderboder").style.opacity = 0;
  var elm = document.querySelectorAll("#ladderresultsvg line");
  for (var i = 0; i < elm.length; i++) {
    if (elm[i].getAttribute("data-line") == no) {
      elm[i].style.opacity = 1;
    } else {
      elm[i].style.opacity = 0;
    }
  }
}

function LineResultView() {
  if (document.getElementById("ladderresultsvg") != undefined)
    document.getElementById("ladderboder").style.opacity = 1;
  var elm = document.querySelectorAll("#ladderresultsvg line");
  for (var i = 0; i < elm.length; i++) {
    elm[i].style.opacity = 1;
  }
}

function svgReset() {
  if (document.getElementById("laddersvg")) {
    document.getElementById("laddersvg").remove();
    document.getElementById("ladderheader").innerHTML = "";
    document.getElementById("ladderfooter").innerHTML = "";
    if (document.getElementById("ladderresultsvg")) {
      document.getElementById("ladderresultsvg").remove();
    }
  }
  document.getElementById("resultuser").innerHTML = "";
}

function randomSetting() {
  if (isSet) {
    return false;
  }
  isSet = true;

  let partCount = document.getElementById("num").value;
  let randomNumber = Math.floor(Math.random() * 10 / 3) + 2;

  let widthLineCount = partCount * randomNumber + Math.floor(Math.random() * partCount);

  // 50~450사이로 골라서 50~(svgHeight-50)
  const Ynumbers = [];
  let whileCount = 0;
  while (Ynumbers.length < widthLineCount) {
    let num = Math.floor(Math.random() * (450 - 50 + 1)) + 50;
    if (Ynumbers.every(n => Math.abs(n - num) >= 7)) {
      Ynumbers.push(num);
    }
    if (whileCount > 1000) {
      // 라인 개수가 401/7 인 57개를 넘어가는 경우 반드시 무한루프가 발생함(경우에 따라서 라인 개수가 더 적더라도 무한루프 발생)
      // 따라서 1000회 이상 시도시 while문을 탈출하도록 함
      break;
    }
    whileCount++;
  }
  randomXArray = [];
  let svgBoard = document.getElementById("laddersvg");


  for (let i = 0; i < Ynumbers.length; i++) {
    let x1 = linewidth / 2 + linewidth * (i % (partCount - 1));
    let x2 = x1 + linewidth;
    let y1 = Ynumbers[i];
    let y2 = y1;

    randomXArray.push(`${x1}/${y2}`);

    svgBoard.insertAdjacentHTML("beforeend", "<line x1=" + x1 + " x2=" + x2 + " y1=" + y1 + " y2=" + y2 + " stroke=\"#000\" stroke-width=\"1\"></line>");
  }

  let ladderheader = document.getElementById("ladderheader");

  let ladderheaderBtn = [];
  var num = document.getElementById("num").value;
  for (let i = 0; i < num; i++) {
    let tempVal = document.getElementById("name" + (i + 1)).value;
    if (tempVal.length > 4) {
      tempVal = tempVal.substr(0, 3) + "..";
    }
    if (!tempVal) tempVal = "이름" + (i + 1);
    ladderheaderBtn.push("<button style='background: " + btnColor[i] + "' onClick='dotStart(" + (i + 1) + ")'>" + tempVal + "</button>");
  }

  ladderheader.innerHTML = ladderheaderBtn.join('');

}

function dotStart(index) {
  let svgBoard = document.getElementById("laddersvg");
  let xCoordinate = 80 * (index - 1) + 40;

  // 경로 정렬
  randomXArray.sort((a, b) => Number(a.split("/")[1]) - Number(b.split("/")[1]));

  // 기존 애니메이션이 실행 중이면 중지
  if (window.animationMap && window.animationMap[index]) {
    cancelAnimationFrame(window.animationMap[index]);
    window.animationMap[index] = null;
  } else {
    if (!window.animationMap) {
      window.animationMap = {};
    }
  }

  // 이미 점이 존재하지 않으면 생성
  if (!document.getElementById("movingCircle" + index)) {
    const dot = `<circle id='movingCircle${index}' cx='${xCoordinate}' cy='0' r='5' fill='${btnColor[index - 1]}' />`;
    svgBoard.insertAdjacentHTML("beforeend", dot);
  }

  let circle = document.getElementById("movingCircle" + index);
  circle.setAttribute("cx", `${xCoordinate}`);
  circle.setAttribute("cy", "0");

  let randomXLength = randomXArray.length;
  let tempX = xCoordinate;
  const pathPoints = [{ x: xCoordinate, y: 0 }];

  for (let i = 0; i < randomXLength; i++) {
    let [x, y] = randomXArray[i].split("/").map(Number);
    if (tempX - x === 0) {
      pathPoints.push({ x: x, y: y });
      tempX += 80;
      pathPoints.push({ x: tempX, y: y });
    } else if (tempX - x === 80) {
      pathPoints.push({ x: x + 80, y: y });
      tempX -= 80;
      pathPoints.push({ x: tempX, y: y });
    }
  }

  pathPoints.push({ x: tempX, y: 500 });

  let currentIndex = 0;
  let nextIndex = 1;

  let yPosition = 0;
  let xPosition = pathPoints[0].x;
  let isAnimating = true;

  function animate() {
    if (!isAnimating) return;

    const speed = ladderSpeed;

    if (currentIndex < pathPoints.length - 1) {
      const nextPoint = pathPoints[nextIndex];

      // 거리 계산
      const dx = nextPoint.x - xPosition;
      const dy = nextPoint.y - yPosition;

      const reachedX = Math.abs(dx) <= speed;
      const reachedY = Math.abs(dy) <= speed;

      if (!reachedY) {
        yPosition += dy > 0 ? speed : -speed;
        circle.setAttribute("cy", yPosition);
      } else {
        yPosition = nextPoint.y;
        circle.setAttribute("cy", yPosition);
      }

      if (!reachedX) {
        xPosition += dx > 0 ? speed : -speed;
        circle.setAttribute("cx", xPosition);
      } else {
        xPosition = nextPoint.x;
        circle.setAttribute("cx", xPosition);
      }

      if (reachedX && reachedY) {
        currentIndex = nextIndex;
        nextIndex++;
      }
    } else {
      isAnimating = false;
      // 결과 출력 부분은 그대로 유지
      if (!document.getElementById("result" + index)) {
        const ladderheader = document.getElementById("ladderheader");
        const ladderfooter = document.getElementById("ladderfooter");
        const userName = ladderheader.children[index - 1].textContent;

        const prizeNum = (Number(circle.getAttribute("cx")) + 40) / 80;
        let prizeName = ladderfooter.children[prizeNum - 1].querySelector("input").value;
        if (!prizeName) {
          prizeName = ladderfooter.children[prizeNum - 1].querySelector("input").placeholder;
        }

        const resultTxt = document.createElement("p");
        resultTxt.id = "result" + index;
        resultTxt.textContent = `${userName} -> ${prizeName}`;
        document.getElementById("resultuser").append(resultTxt);
      }
      return;
    }

    window.animationMap[index] = requestAnimationFrame(animate);
  }


  isAnimating = true;
  window.animationMap[index] = requestAnimationFrame(animate);



}