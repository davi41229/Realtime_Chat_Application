import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../Styles/Home.css';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends React.Component{
   
    render(){
        const paper={
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            paddingLeft:'10px',
            paddingRight:'10px',
            marginTop:'60px'
        }
       
        return(
           <Grid container component="main" className="root">
               <Grid item xs={1} sm={4} md={7} className="imagehome">
                   <div className="homeleftimage">
                   </div>
                   </Grid>
                   <Grid item xs={12} sm={8} md={5} className="homerightcomponent" elevation={6} square>
                       <Card className="homeitem1">
                           <button class="btnhome">
                               <i class="fa fa-home">Welcome</i>
                           </button>
                       </Card>
                       <div style={paper}>
                               <h1 style={{color:'#366464',backgroundColor:'#0e1111',padding:'10px 10px'}}>
                                   Chat Box App
                               </h1>
                               <Link to="/Login" >
                                   <button class="button1">
                                       <span>Login</span>
                                   </button>
                               </Link>
                           </div>
                   </Grid>
           </Grid>
        );
    };
};
export default Home;