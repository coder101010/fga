import React, { Component } from 'react';
import axios from 'axios';
import TimeAgo from 'timeago-react'; 
import LazyLoad from 'react-lazy-load';
import Geocode from "react-geocode";
import FancySelect from "react-fancy-select";
import "react-fancy-select/lib/react-fancy-select.css";

class Home extends Component {
    constructor() {
        super();

        this.state = {
            posts: [],
            order: ''
        };

    }
    componentDidMount() {

        let getOrder = window.location.search;
        let params = new URLSearchParams(getOrder);
        let order = params.get('order');
        
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD5IyPD-Rc_OWnsQxYhf7IkhYyXuUiRQUo";
        script.async = true;
        document.body.appendChild(script);

        axios.get('https://api.myjson.com/bins/jpfmg').then( results => {
            
            let posts = results.data;
            
            if(order ===  'oldest' ){
                posts.reverse();
            }
            
            this.setState({ posts: posts });
            
        });

        this.updateOrderNav(order);
    
    };
    submitEvaluation(submission) {
        
        let submissionEl = document.getElementById(submission),
            rating = submissionEl.querySelector('select'),
            comment = submissionEl.querySelector('textarea'),
            submitBtn = submissionEl.querySelector('.js-submission'),
            successMsg = submissionEl.querySelector('.js-evaluated')
            
            submitBtn.style.opacity = '0.75';

            axios.post('https://demo0929535.mockable.io/evaluate', {
                evaluation: rating.value,
                comment: comment.value
              })
              .then(function (response) {

                if( response.status === 201 || response.status === 200 ){
                    submitBtn.style.display = 'none';
                    successMsg.style.display = 'block';
                    rating.readOnly = true;
                    submitBtn.readOnly = true;
                }

              })
              .catch(function (error) {
                console.log(error);
            });

        setTimeout(function() {  

            window.scroll({
                top: submissionEl.offsetTop - 78,
                behavior: 'smooth'
            })            
            
        }, 100);

    }
    updateImage(submission, direction, src, img, lat, lon) {

        let prevActive = document.querySelector('.Home-submission_entry.active'),
            prevActiveThumb = document.querySelector('.Home-submission_entry img.active'),
            media = document.getElementById('media'),
            nextElement = document.getElementById(submission);
    
        if( prevActive ){
          prevActive.classList.remove('active');
        }
    
        if( prevActiveThumb ){
          prevActiveThumb.classList.remove('active');
        }
    
        document.getElementById('map').style.display = 'none';
    
        media.style.display = 'block';
        media.querySelector('img').setAttribute('src', src);
        
        nextElement.classList.add('active');
        nextElement.querySelector('img.img_'+img).classList.add('active');
    
        media.querySelector('.image-meta').innerHTML = direction + ' View <a target="_blank" href="' +src + '">View Full Size</a>';
    
        Geocode.setApiKey("AIzaSyD5IyPD-Rc_OWnsQxYhf7IkhYyXuUiRQUo");
        Geocode.fromLatLng(lat, lon).then(
          response => {
            const address = response.results[0].formatted_address;
            media.querySelector('.image-address').innerHTML = address + '<br>(Lat: '+ lat + ' Long: ' + lon + ')';
          },
          error => {
            console.error(error);
          }
        );
        
        window.scroll({
          top: nextElement.offsetTop - 78,
          behavior: 'smooth'
        })
    
      }
    
      updateMap(submission, lat, lon) {
    
        let mediaEl = document.getElementById('media'),
            mapEl = document.getElementById('map'),
            prevActive = document.querySelector('.Home-submission_entry.active'),
            prevActiveThumb = document.querySelector('.Home-submission_entry img.active'),
            nextElement = document.getElementById(submission);
    
        mediaEl.style.display = 'none';
        mapEl.style.display = 'block';
    
        if( prevActive ){
          prevActive.classList.remove('active');
        }
    
        if( prevActiveThumb ){
          prevActiveThumb.classList.remove('active');
        }
    
        nextElement.classList.add('active');
        nextElement.querySelector('img.map').classList.add('active');
    
        let map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: parseInt(lat), lng: parseInt(lon)},
          zoom: 15,
          minZoom : 3,
          maxZoom : 10,
          mapTypeControl: false,
          zoomControl: true,
          scaleControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeId: 'satellite',      
        });
    
        let myLatLng = {lat: parseInt(lat), lng: parseInt(lon)};
        let marker = new window.google.maps.Marker({
          position: myLatLng,
          map: map
        });
    
        map.addListener('zoom_changed', () => {
          this.setState({
            zoom: map.getZoom(),
          });
        });
        map.addListener('maptypeid_changed', () => {
          this.setState({
            maptype: map.getMapTypeId(),
          });
        });
    
        window.scroll({
          top: nextElement.offsetTop - 78,
          behavior: 'smooth'
        })
    
      }
    updateOrderNav(order){

        let newestOrderLink = document.querySelector('.newestOrder'),
            oldestOrderLink = document.querySelector('.oldestOrder');
    
        if( order === 'oldest' ) {
          oldestOrderLink.classList.add('active');
        }else{
          newestOrderLink.classList.add('active');
        }

    }
    enableSubmit(submission) {

        let nextElement = document.getElementById(submission);
        document.querySelector('.js-submission').style.display = 'none';
        nextElement.querySelector('.js-submission').style.display = 'inline-block';

    }

    render() {

        const { posts } = this.state;
        const items = [{
            id: 1,
            value: '1',
            text: 'Approved',
          }, {
            id: 2,
            value: '2',
            text: 'Rejected (Photos)',
          }, {
            id: 3,
            value: '3',
            text: 'Rejected (Classifications)',
          }, {
            id: 4,
            value: '4',
            text: 'Rejected (Location)',
          }, {
            id: 9,
            value: '9',
            text: 'Rejected',
          }];

      return (
          <div className="Home Home-wrapper" >

            <div className="Home-media">
                <div className="Home-map" id='app'>
                    <div id='map' style={{width: '100%', height: '100vh', display: 'none'}}></div>
                    <div id='media' style={{width: '100%', height: '100vh', display: 'none'}}>                        
                        <img id="image" alt="Preview"></img>
                        <div className="image-meta"></div>
                        <div className="image-address">Address</div>
                    </div>
                </div>            
            </div>            

            <div className="Home-submissions">
                <div className="Home-submissions-title">
                    <h2>Submissions<span className="sort">Sort: <a href="/?order=newest" className="newestOrder">Newest to Oldest</a> | <a href="/?order=oldest" className="oldestOrder">Oldest to Newest</a></span></h2>
                </div>
            
            {
            posts.map( post => (

                <div key={ post.id }  className="Home-submission_entry" id={ post.id } >
                    <h3>John Doe<span className="h3"><TimeAgo
                    datetime={post.timestamp}/></span></h3>
                    <div className="Home-submission_media">
                    <div className="Home-submission_media-item">
                        <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateImage( post.id, post.photos[0].direction, post.photos[0].url, 0, post.location.lat, post.location.lon )}}  alt={post.photos[0].direction} src={post.photos[0].url} height="75px" className="img_0"></img>
                            </LazyLoad>
                        </div>

                        <div className="Home-submission_media-item">
                            <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateImage( post.id, post.photos[1].direction, post.photos[1].url, 1, post.location.lat, post.location.lon )}}  alt={post.photos[1].direction} src={post.photos[1].url} height="75px" className="img_1"></img>
                            </LazyLoad>
                        </div>

                        <div className="Home-submission_media-item">
                        <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateImage( post.id, post.photos[2].direction, post.photos[2].url, 2, post.location.lat, post.location.lon )}}  alt={post.photos[2].direction} src={post.photos[2].url} height="75px" className="img_2"></img>
                            </LazyLoad>
                        </div>

                        <div className="Home-submission_media-item">
                        <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateImage( post.id, post.photos[3].direction, post.photos[3].url, 3, post.location.lat, post.location.lon )}}  alt={post.photos[3].direction} src={post.photos[3].url} height="75px" className="img_3"></img>
                            </LazyLoad>
                        </div>

                        <div className="Home-submission_media-item">
                        <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateImage( post.id, post.photos[4].direction, post.photos[4].url, 4, post.location.lat, post.location.lon )}}  alt={post.photos[4].direction} src={post.photos[4].url} height="75px" className="img_4"></img>
                            </LazyLoad>
                        </div>

                        <div className="Home-submission_media-item">
                        <div className="filler" />
                            <LazyLoad height={51} offsetVertical={250}>
                            <img onClick={() => {this.updateMap( post.id, post.location.lat, post.location.lon )}} alt="MapsSatellite View" src={'https://maps.googleapis.com/maps/api/staticmap?center=' + post.location.lat + ',' + post.location.lon +'&zoom=15&scale=1&size=600x300&maptype=satellite&format=png&visual_refresh=true&key=AIzaSyD5IyPD-Rc_OWnsQxYhf7IkhYyXuUiRQUo'} height="75px" className="s-rounded map"></img>
                            </LazyLoad>
                        </div>
                        <div className="Home-submission_entry-tags">
                            <span>{ post.landobservations[0].landcover }</span>
                            <span>{ post.landobservations[0].landuse }</span>
                        </div>     

                        </div>     

                        <div className="Home-submission_entry-expanded">
                        <div className="Home-submission_entry-comment">
                            <h4>Evaluate Submission</h4>
                            <form>
                            <FancySelect
                                items={items}
                                onSelection={(item) => this.enableSubmit(post.id)}
                            />
                            <textarea className="js-submission-comments" placeholder="Enter your comment..."></textarea>
                             <a className="js-submission Home-submission_entry-submit" href="#" onClick={() => {this.submitEvaluation( post.id )}} >Submit</a>
                                <div className="js-evaluated Home-submission_entry-evaluated">Successfully posted!</div>
                            </form>
                        </div>

                        </div>

                    </div>          

                ))
            }
            </div>

        </div>

      );
    } 
}
  
export default Home;
  