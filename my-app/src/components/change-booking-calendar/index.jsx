import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

import './styles.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

import CalendarForm from '../calendarform/CalendarForm';


// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries




const firebaseApp = initializeApp({
  apiKey: "AIzaSyC_iHDVZc4s5rlDsW2YrL4LBHAax6UNOBM",
  authDomain: "stivo-9ebcd.firebaseapp.com",
  projectId: "stivo-9ebcd"
});

// Har denna bara för att det inte dyker upp som ESLint varning så Netlify kan deploya.
// console.log(firebaseApp);


const db = getFirestore(firebaseApp);







function ChangeBookingCalendar() {


    // För Datum värdet.
    const [value, onChange] = useState(new Date());

    // State för att kunna visa/Dölja formen. När formState=null då är den stängd, när den har värde så syns den.
    const [formState, setFormState] = useState();


    // Array för att samla alla dublicate-dates, den är tom i början. 
    const [duplDatesArray, setDuplDatesArray] = useState([]);

    // Används för att se till så att datan är fullständig innan den renderar ut det i kalendern. Den är satt till false i början.
    const [duplDatesArrayComplete , setDuplDatesArrayComplete] = useState(false)

  

    // Funktion för att skriva till databasen.
async function addToDb() {
  
  try {
    const docRef = await addDoc(collection(db, "bookedTimes"), {
      firstname: document.querySelector("input[name='firstname']").value,
      lastname: document.querySelector("input[name='lastname']").value,
      email: document.querySelector("input[name='email']").value,
      date: document.querySelector("input[name='date']").value,
      time: document.querySelector("#validationCustom04").value,
      description: document.querySelector("#description1").value,
      
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: " , e);
    
  }
  
}




// Funktion för att kontrollera om tid är tillgänglig. Jämför med datan i databasen.
async function checkIfTimeAvailable () {


const querySnapshot = await getDocs(collection(db, "bookedTimes"));

// För varje data............
querySnapshot.forEach((doc) => {

// ...All data från DB och  omvandla till en array...
const dataToArray = Object.values(doc.data());

// ... Ta fram alla options i array...
const timeOptionsArr = document.querySelectorAll("option");

// ... Ta fram datumvärdet...
const dateValue = document.querySelector("input[name='date']").value;

// Om datan från DB som ligger i en array inkluderar Datum-värdet som är synlig......
if(dataToArray.includes(dateValue)) {
  // .... Då för varje värde i tid-options ... 
  timeOptionsArr.forEach((e)=>{
    // ...kolla igen om datan från DB innehåller tiderna som syns...
    if(dataToArray.includes(e.value)) {
      
      // .... om ja, då disable:a tid-options.....
     document.getElementById("validationCustom04").options.namedItem(`${e.value}`).disabled = true;
    }
  });

}

});
}






    // Funktion för att öppna formen..
    const openForm = () => {
      setFormState("Just a value to open form");
      checkIfTimeAvailable();
    }


    // Funktion för att stänga formen. (Se kommentar ovan för formState..)
    const cancelFormFunc = () => {
      setFormState(null);
    }



   


    // Funktion för checka om Datum är full ...idén är att hitta alla duplcates för att jag vet att samma datum kan bara finnas 4 gånger i DB:n eftersom det finns bara 4 st tider att boka per dag .. Så om DB:n innehåler 4 samma datum så släck datumet...
    const checkIfDateFull = async() => {
      const querySnapshot = await getDocs(collection(db, "bookedTimes"));

      // Skapa en array av datum, som är tom i början.
      // eslint-disable-next-line
      let arrayOfDates = [];

      // För varje data... 
      querySnapshot.forEach((doc) => {
        // .. och för varje datum-värde i datan pusha till arrayOfDates arrayen ... 
        arrayOfDates.push(doc.data().date);
        });
      

        // Funktion för att hitta duplicates.
      function findDuplicateInArray(arra1) {
        // eslint-disable-next-line
        let object = {};
        // eslint-disable-next-line
        let result = [];

        // eslint-disable-next-line
        arra1.forEach(function (item) {
          if(!object[item])
              object[item] = 0;
            object[item] += 1;
        })
        // eslint-disable-next-line
        for (var prop in object) {
          // Lägger värde 4 här eftersom det finns 4 tider.
           if(object[prop] === 4) {
               result.push(prop);
           }
        }
        return result;
    }

    // Använd duplicate-funktionen för att hitta duplikater i arrayOfDates arrayen... och så lägga dublicates i en ny array för att använda den för att disabla dates senare..
    // eslint-disable-next-line
    let arrayOfFourDuplDates = findDuplicateInArray(arrayOfDates);
    arrayOfFourDuplDates.forEach((theDate)=>{
      // Sätt in dublicate-date:n i en array och omvandla samtidigt till ett datum-värde..
      setDuplDatesArray(prev => [...prev, new Date(theDate)]);
    });


    // Används för att se till så att allt laddas klart innan rendering av kalendern.. se kommentar för state:n
    setTimeout(()=>{
      setDuplDatesArrayComplete(true);
    },1000);
    
    }
    

    // useEffect för att kunna köra functionen bara en gång. Bara "[]" som dependency för att köra useEffect:en en gång också "eslint-disable line" kommentaren för att ignorera eslint error.
    useEffect(() => {
      checkIfDateFull();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

      
      



    const success = () => {
      cancelFormFunc();

      document.querySelector(".kalendertext").innerHTML = "Thank you for your booking!";
      document.querySelector(".kalendertext").style = "color: green";


    }




    
    
   
  
    return (

      <div key={Math.random()}>
       {duplDatesArray && duplDatesArrayComplete ===true && <Calendar 

       onChange={onChange} 

       onClickDay={(value) => {
         onChange(value);
         openForm();
        }} 

       minDate={new Date()}  

       value={value} 
       
       tileDisabled={({date, view}) =>
                    (view === 'month') && // Block day tiles only
                    duplDatesArray.some(disabledDate =>
                      date.getFullYear() === disabledDate.getFullYear() &&
                      date.getMonth() === disabledDate.getMonth() &&
                      date.getDate() === disabledDate.getDate()
                    )} />  }
        
        {/* eslint-disable */}
        {formState && <CalendarForm dayValue={value.toLocaleDateString("sv-SE")} cancelForm={cancelFormFunc}  addBooking={addToDb}  showSuccess={success} />}
                    

      


      </div>
     
    );
  }

export default ChangeBookingCalendar;