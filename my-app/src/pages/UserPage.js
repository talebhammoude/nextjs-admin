import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, getDoc,  doc, deleteDoc, setDoc } from "firebase/firestore";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
// eslint-disable-next-line
import CancelBookingForm from 'src/components/cancel-booking-form';
// eslint-disable-next-line
import ViewBookingForm from 'src/components/view-booking-comp';
// eslint-disable-next-line
import ChangeBookingCalendar from 'src/components/change-booking-calendar';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';







// ----------------------------------------------------------------------
// eslint-disable-next-line


const firebaseConfig = {
  apiKey: "AIzaSyC_iHDVZc4s5rlDsW2YrL4LBHAax6UNOBM",
  authDomain: "stivo-9ebcd.firebaseapp.com",
  projectId: "stivo-9ebcd",
  storageBucket: "stivo-9ebcd.appspot.com",
  messagingSenderId: "49507795581",
  appId: "1:49507795581:web:25198d384b9db473d62714",
  measurementId: "G-P7K9X2N1EM",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig, "my-unique-app-name");

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);







const TABLE_HEAD = [
  { id: 'name', label: 'Namn', alignRight: false },
  { id: 'mail', label: 'Epost', alignRight: false },
  { id: 'date', label: 'Datum', alignRight: false },
  { id: 'time', label: 'Tid', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

  const [data, setData] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showCancelForm, setShowCancelForm] = useState(false);

  const [showViewForm, setShowViewForm] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const [optionId, setOptionId] = useState();
  
  


  const getDataAfterToday = async () => {
    const today = new Date().toISOString().substr(0, 10);
    const q = query(collection(db, "bookedTimes"), where('date', '>=', today));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log();
      // eslint-disable-next-line
       setData(prev => [...prev, {id: doc.id, name: doc.data().firstname +' '+ doc.data().lastname, email: doc.data().email, date: doc.data().date, time: doc.data().time, status: 'active'}]);
       
    });
    
  };



  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleCancelBookingClick = () => {
    setShowCancelForm(true)
    setOpen(null);
  }


  const setFormFieldsOnChange = async ()=> {

    const docRef = doc(db, "bookedTimes", optionId);
    const docSnap = await getDoc(docRef); 
          
    document.querySelector('[name="firstname"]').value = docSnap.data().firstname;
    document.querySelector('[name="lastname"]').value = docSnap.data().lastname;
    document.querySelector('[name="email"]').value = docSnap.data().email;
    document.querySelector('[name="date"]').value = docSnap.data().date;
    document.querySelector('[name="time"]').value = docSnap.data().time;
    document.querySelector('[name="descr"]').value = docSnap.data().description;
          
  }


  const handleViewBookingClick = () => {
    setShowViewForm(true)
    setOpen(null);
    setTimeout( async ()=> {

    await setFormFieldsOnChange();
      
    },300)
    
  }


  const handleCancelBooking = async () => {
    await deleteDoc(doc(db, "bookedTimes", optionId));
    setTimeout(()=>{
      window.location.reload();
    },130)
  }


  const handleChangeBooking =  () => {
    const docRef = doc(db, "bookedTimes", optionId);
    setDoc(docRef, {
      firstname: document.querySelector('[name="firstname"]').value,
      lastname: document.querySelector('[name="lastname"]').value,
      email: document.querySelector('[name="email"]').value,
      date: document.querySelector('[name="date"]').value, 
      time: document.querySelector('[name="time"]').value,
      description: document.querySelector('[name="descr"]').value,
    });

    setTimeout(()=>{
      window.location.reload();
    },400)
  }


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

// eslint-disable-next-line
  useEffect(() => {
    getDataAfterToday();
  }, []);

  console.log(data)
  console.log(USERLIST);
  
  return (
    <>
      <Helmet>
        <title> Admin | Hantera bokningar </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Hantera bokningar
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, name, email, status, date, time } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox disabled checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={`/assets/images/avatars/avatar_${ index + 1}.jpg`} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{date}</TableCell>

                        <TableCell align="left">{time}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell>

                        <TableCell onClick={()=>{setOptionId(id)}} align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Kunde inte hittas
                          </Typography>

                          <Typography variant="body2">
                            Inga resultat hittades &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Försök att söka med hela ord.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rader per sida"
            labelDisplayedRows= {({ from, to, count })=>{
              return `${from}–${to} av ${count !== -1 ? count : `more than ${to}`}`;
            }}

          />
        </Card>
      </Container>

      <Popover
       
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >


        <MenuItem onClick={handleViewBookingClick} >
          <Iconify icon={'mingcute:more-3-line'} sx={{ mr: 2 }} />
          Visa
        </MenuItem>

        <MenuItem  >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Ändra
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleCancelBookingClick} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Avboka
        </MenuItem>

        
      </Popover>
      {showCalendar && <ChangeBookingCalendar />}
      {showViewForm && <ViewBookingForm showViewBookingForm={setShowViewForm} />}
      {showCancelForm && <CancelBookingForm showCancelBookingForm={setShowCancelForm} handleCancelBooking={handleCancelBooking} />}
    </>
  );
}
