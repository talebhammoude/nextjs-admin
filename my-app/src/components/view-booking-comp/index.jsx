import 'bootstrap/dist/css/bootstrap.min.css';
import {Form , Button, Row, Col} from "react-bootstrap";
import "./styles.css";





function ViewBookingForm(props) {
  

  const handleCloseClick = ()=> {
    props.showViewBookingForm(false)
  }

  


  return (
    <div >

      <div className='backdrop' />
      <div className='view-form-dialog'>


      
      <Form   >
      

      <Row className="mb-4">
        <h2>Visa bokning</h2>
      </Row>

      {/* eslint-disable */}
      <Row className="mb-4"></Row>

      <Row className="mb-4">
        <Form.Group as={Col} md="3" controlId="validationCustom01">
          <Form.Label>Förnamn</Form.Label>
          <Form.Control
            readOnly
            
            type="text"
            placeholder="......"
      
            name="firstname"
           
          />
          <Form.Control.Feedback></Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom02">
          <Form.Label>Efternamn</Form.Label>
          <Form.Control
            readOnly
            type="text"
            placeholder="......."
            
            name="lastname"
           
          />
          <Form.Control.Feedback></Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" >
          <Form.Label>E-post</Form.Label>
          <Form.Control type="text" placeholder="........."  readOnly name="email" />
          <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>
       
      </Row>

      <Row className="mb-4"></Row>


      <Row className="mb-3">
        <Form.Group as={Col} md="6" >
          <Form.Label >Datum</Form.Label>
          <Form.Control  type="text"   readOnly placeholder="........"  name="date" />
        </Form.Group>
        <Form.Group readOnly as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Tid</Form.Label>
          <Form.Control placeholder="........." type="text" readOnly  name="time" />
          
        </Form.Group>
        
      </Row>


      <Row className="mb-4"></Row>


      <Row className="mb-2">
        <Form.Group className="mb-1"  >
        <Form.Label>Beskrivning</Form.Label>
        <Form.Control id="description1" as="textarea" rows={2} name="descr" placeholder="............."  readOnly/>
        </Form.Group>
      </Row>


      
      
      <Button className='btn-primary' onClick={handleCloseClick}>Stäng</Button>
     

    

    </Form>
    
      </div>
    </div>
  );
}

export default ViewBookingForm;