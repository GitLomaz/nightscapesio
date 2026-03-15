function titleCase(str) {
  let splitStr = str.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function numberWithCommas(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateHitRate(hit, flee) {
  let chance = hit - flee;
  if (chance >= 100) {
    return 100;
  } else {
    if (chance < 10) {
      return 10;
    }
    return chance;
  }
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    mod =
      1 /
      parseFloat(
        $("#menuContainer")
          .parent()
          .css("transform")
          .split("(")[1]
          .split(",")[0]
      );
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX * mod;
    pos4 = e.clientY * mod;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    mod =
      1 /
      parseFloat(
        $("#menuContainer")
          .parent()
          .css("transform")
          .split("(")[1]
          .split(",")[0]
      );
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX * mod;
    pos2 = pos4 - e.clientY * mod;
    pos3 = e.clientX * mod;
    pos4 = e.clientY * mod;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
