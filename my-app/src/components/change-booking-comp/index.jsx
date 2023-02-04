import 'bootstrap/dist/css/bootstrap.min.css';
import {Form , Button, Row, Col} from "react-bootstrap";
import "./styles.css";
import {useState} from 'react'




function ChangeBookingForm(props) {
  

  const handleAvbrytClick = ()=> {
    props.showChangeBookingForm(false)
  }

  


  return (
    <div >

      <div className='backdrop' />
      <div className='change-form-dialog'>


      
      <Form   >
      

      <Row className="mb-4">
        <h2>Ändra bokning</h2>
      </Row>

      {/* eslint-disable */}
      <Row className="mb-4"></Row>

      <Row className="mb-4">
        <Form.Group as={Col} md="3" controlId="validationCustom01">
          <Form.Label>Förnamn</Form.Label>
          <Form.Control
            readOnly
            
            type="text"
            placeholder="..."
      
            name="firstname"
           
          />
          <Form.Control.Feedback></Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom02">
          <Form.Label>Efternamn</Form.Label>
          <Form.Control
            readOnly
            type="text"
            placeholder="..."
            
            name="lastname"
           
          />
          <Form.Control.Feedback></Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" >
          <Form.Label>E-post</Form.Label>
          <Form.Control type="email" placeholder="namn@exempel.com" readOnly name="email" />
          <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>
       
      </Row>

      <Row className="mb-4"></Row>


      <Row className="mb-3">
        <Form.Group as={Col} md="6" >
          <Form.Label >Önskad datum</Form.Label>
          <Form.Control  type="text"   required   name="date" />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Välj önskad tid</Form.Label>
          <Form.Select name="time" >
            <option id="no-options" value=""></option>
            <option id="12:00 - 13:00" value="12:00 - 13:00">12:00 - 13:00</option>
            <option id="13:10 - 14:10" value="13:10 - 14:10">13:10 - 14:10</option>
            <option id="14:20 - 15:20" value="14:20 - 15:20">14:20 - 15:20</option>
            <option id="15:30 - 16:30" value="15:30 - 16:30">15:30 - 16:30</option>
          </Form.Select>
        </Form.Group>
        
      </Row>


      <Row className="mb-4"></Row>


      <Row className="mb-2">
        <Form.Group className="mb-1"  >
        <Form.Label>Beskriv ditt fall</Form.Label>
        <Form.Control id="description1" as="textarea" rows={2} name="descr"   required/>
        </Form.Group>
      </Row>


      
      <Button  className='btn-primary'  >Ändra</Button>
      <Button className='btn-primary' onClick={handleAvbrytClick}>Avbryt</Button>
     

    

    </Form>
    
      </div>
    </div>
  );
}

export default ChangeBookingForm;