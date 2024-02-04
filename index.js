let IP;
let postData;


const hero = document.getElementById("hero");
const resp = document.querySelector(".respOnse");
const searchBox = document.getElementById("searchBox");
const errorBar = document.getElementById("errorBar");
const errorPage = document.getElementById("errorPage");

$.getJSON("https://api.ipify.org?format=json", function (data) {
  // Setting text of element P with id gfg
  $("#gfg").html(data.ip);
  IP = data.ip;
});
const getInfoBtn = document.getElementById("getInfoBtn");

getInfoBtn.addEventListener("click", () => searchMe());

async function searchMe() {
  // console.log(hero);
  // while(hero.lastChild){
  //     hero.removeChild(hero.lastChild);
  // }
  hero.style.display = "none";

  try {
    const info = await getInfo();
    const posto = await getAllPostOffice(info.postal);
    postData = posto;

    resp.style.display = "block";
    setAllValues(info, posto);
    setAllPostOffice(posto);

    console.log("All promises have settled successfully. ✅");
  } catch (error) {
    console.error("An error occurred: ☠️", error);
    alert("An error occurred: " + error);
    errorBar.innerText = `${error}`;
    errorPage.style.display = "flex";
  }
}


async function getInfo() {
  const res = await fetch(`https://ipapi.co/${IP}/json/`);

  if (res.ok) {
    try {
      const data = await res.json();
      console.log("mydata",data)

      setGoogleMapsCoordinates(data.latitude, data.longitude, 10);
      return data;
    } catch (error) {
      return new Error("IP not found", error);
    }
  } else {
    return new Error("IP Status not found");
  }

}

// Function to set the Google Maps iframe URL with custom coordinates
function setGoogleMapsCoordinates(latitude, longitude, zoom) {
  var iframe = document.getElementById("googleMapsIframe");

  // Construct the Google Maps URL with the provided coordinates and zoom level
  var googleMapsURL = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  // Set the iframe src attribute to the generated URL
  iframe.src = googleMapsURL;
}


async function getCurrentTime(timezone) {
  // current datetime string in America/Chicago timezone
  let chicago_datetime_str = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  let date_chicago = new Date(chicago_datetime_str);

  let hours = date_chicago.getHours();
  let minutes = date_chicago.getMinutes();
  let seconds = date_chicago.getSeconds();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  let year = date_chicago.getFullYear();

  let month = ("0" + (date_chicago.getMonth() + 1)).slice(-2);

  let date = ("0" + date_chicago.getDate()).slice(-2);

  let date_time = year + "-" + month + "-" + date + " / " + formattedTime;

  return date_time;
}
async function getAllPostOffice(pincode) {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

  if (!res.ok) {
    return new Error("Response is not a valid post");
  } else {
    try {
      const jdata = await res.json();
        console.log("jdata",jdata)
      return jdata;
    } catch (error) {
      return new Error("POST OFFICE API PROBLEM", error);
    }
  }
}
async function setAllValues(data, x) {
  document.getElementById("myIp").innerText = ":  " + data.ip;
  document.getElementById("myLong").innerText = data.longitude;
  document.getElementById("myLat").innerText = data.latitude;
  document.getElementById("myCity").innerText = data.city;
  document.getElementById("myRegion").innerText = data.region;
  document.getElementById("myOrganisation").innerText = data.org;
  document.getElementById("myHostName").innerText = data.asn;

  document.getElementById("myTimeZone").innerText = data.timezone;

  let time = await getCurrentTime(data.timezone);

  document.getElementById("myDatendTime").innerText = time;

  document.getElementById("myPincode").innerText = data.postal;

  let z = await x;
  document.getElementById("myMessage").innerText = z[0].Message;
}
function setAllPostOffice(arr) {
  const cont = document.getElementById("H4container");

  arr[0].PostOffice.map((e) => {
    const card = document.createElement("div");
    card.classList = "card";
    card.innerHTML = `<h4>Name - <b>${e.Name}</b></h4><h4>Branch Type - <b>${e.BranchType}</b></h4><h4>Delivery Status - <b>${e.DeliveryStatus}</b></h4><h4>District - <b>${e.District}</b></h4><h4>Division - <b>${e.Division}</b></h4>`;
    cont.append(card);
  });
}
//search functionality

searchBox.addEventListener("input", (e) => searchCard(e.target.value));

async function searchCard(str) {
  const data = postData[0].PostOffice;

  const searchValue = str.toLowerCase();

  // Filter the data based on the search value
  const filteredData = await data.filter((e) =>
    e.Name.toLowerCase().includes(searchValue)
  );
  const cardContainer = document.getElementById("H4container");
  // Clear the card container
  cardContainer.innerHTML = "";

  // Generate and display cards for the filtered data
  filteredData.forEach((e) => {
    const card = document.createElement("div");
    card.classList = "card";
    card.innerHTML = `<h4>Name - <b>${e.Name}</b></h4><h4>Branch Type - <b>${e.BranchType}</b></h4><h4>Delivery Status - <b>${e.DeliveryStatus}</b></h4><h4>District - <b>${e.District}</b></h4><h4>Division - <b>${e.Division}</b></h4>`;
    cardContainer.append(card);
  });
}

// let arr1 = [
//   {
//     Message: "Number of pincode(s) found:7",
//     Status: "Success",
//     PostOffice: [
//       {
//         Name: "Indore ",
//         Description: null,
//         BranchType: "Head Post Office",
//         DeliveryStatus: "Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Indore CGO Complex",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Indore Manorama Ganj",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Indore Takshashila",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Indore Tukoganj",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Indore Uchchanyayalay",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//       {
//         Name: "Radio Colony Indore",
//         Description: null,
//         BranchType: "Sub Post Office",
//         DeliveryStatus: "Non-Delivery",
//         Circle: "Madhya Pradesh",
//         District: "Indore",
//         Division: "Indore City",
//         Region: "Indore",
//         Block: "Indore",
//         State: "Madhya Pradesh",
//         Country: "India",
//         Pincode: "452001",
//       },
//     ],
//   },
// ];