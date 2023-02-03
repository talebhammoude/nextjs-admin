import 'bootstrap/dist/css/bootstrap.min.css';
import {Form , Button, Row, Col} from "react-bootstrap";
import "./styles.css";





function CancelBookingForm(props) {
  
  const handleAvbrytClick = ()=> {
    props.showCancelBookingForm(null);
  }

  const handleJaClick = ()=> {
    props.handleCancelBooking();
  }


  return (
    <div >

      <div className='backdrop' />
      <div className='cancel-form-dialog'>


      
      <Form   >
      

      <Row className="mb-4">
        <h2>Är du säker på att du vill avboka?</h2>
      </Row>

      
      <Button  className='btn-primary' onClick={handleJaClick} >Ja</Button>
      <Button className='btn-warning' onClick={handleAvbrytClick} >Avbryt</Button>
     

    

    </Form>
    
      </div>
    </div>
  );
}

export default CancelBookingForm;