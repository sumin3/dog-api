import React from 'react';
import Select from 'react-select';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './Styles/LandingPage.css'


class LandingPage extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedOption: null,
    }
  }
  componentDidMount() {
    let allBreeds = JSON.parse(localStorage.getItem("cacheAllBreeds"));


    if (allBreeds) {
      /* if not the first time to visit the page:
        set matchBreeds (breeds list) to the first 12 breeds of the allBreeds list
      */
      this.setState({ breedsOption: allBreeds, matchBreeds: allBreeds.slice(0, 12) })
    }
    else {
      /* if the first time to visit the page:
         Get all breeds and store in local storage
       */
      fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(response => {
          let breeds = [];
          for (let name in response.message) {
            breeds.push({
              value: name,
              label: name,
              subBreeds: [{ value: name }, ...response.message[name].map(item => ({ value: item }))]
            })
          }
          this.setState({ breedsOption: breeds, matchBreeds: breeds.slice(0, 12) })
          localStorage.setItem("cacheAllBreeds", JSON.stringify(breeds));
        })
        .catch(error => { console.log('Error, no results found') })
    }

  }

  handleChange = selectedOption => {
     /* Find the subBreeds list with selected value
      */
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);

    if (this.state.breedsOption) {
      for (let breed of this.state.breedsOption) {
        if (breed.value === selectedOption.value) {
          this.setState({ selected_option: selectedOption.value, matchBreeds: breed.subBreeds });
        }
      }
    }
  };

  handleImg = SelectedBreed => {
    /* style: change button background and text color when the button is click */
    if (document.getElementById(this.state.selected_breed)) {
      document.getElementById(this.state.selected_breed).style.backgroundColor = "white";
      document.getElementById(this.state.selected_breed).style.color = "black";
    }
    document.getElementById(SelectedBreed).style.backgroundColor = "#3f51b5";
    document.getElementById(SelectedBreed).style.color = "white";


    let result = JSON.parse(localStorage.getItem("cacheResult"));
    let breed_name;
    let selected_option = this.state.selected_option;

    /* handle case:
       when user click on the defaut button (first 12 breeds)
    */
    if (selected_option === undefined)
      selected_option = SelectedBreed;

    /* determine the selected breed is sub breed or not */
    if (selected_option === SelectedBreed)
      breed_name = SelectedBreed;
    else
      breed_name = selected_option + "/" + SelectedBreed;

    
    if (result && result[breed_name]) {
      /* if results cache in local storage:
        set the BreedImgList to the cache results
      */
      this.setState({ selected_breed: SelectedBreed, BreedImgList: result[breed_name] })
    }
    else {
      /* Otherwise:
         make a new request and store the result to local storage
      */
      fetch('https://dog.ceo/api/breed/' + breed_name + '/images')
        .then(response => response.json())
        .then(response => {
          this.setState({ selected_breed: SelectedBreed, BreedImgList: response.message })
          localStorage.setItem("cacheResult", JSON.stringify({ [breed_name]: response.message, ...JSON.parse(localStorage.getItem("cacheResult")) }));
        })
        .catch(error => { console.log('Error, no results found') })
    }
  }
  render() {
    /* mapping the breeds buttons */
    let breeds_btn;
    if (this.state.matchBreeds) {
      breeds_btn = this.state.matchBreeds.map(breed => {
        return (
          <Card onClick={() => this.handleImg(breed.value)} id={breed.value} key={breed.value} style={{ minWidth: '105px', textAlign: "center" }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {breed.value}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )
      })
    }
     /* mapping the image */
    let breeds_img;
    if (this.state.BreedImgList) {
      breeds_img = this.state.BreedImgList.map(img => {
        return (
          <img className="image" key={img} src={img} ></img>
        )
      })
    }
    return (
      <div className="Landing-container">
        <Select
          placeholder="Type a breed name and hit enter"
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={this.state.breedsOption}
        />
        <br />
        <div className="grid-btn-container">
          {breeds_btn}
        </div>
        <br />
        <div className="grid-img-container">
          {breeds_img}
        </div>
      </div>
    );
  }
}
export default LandingPage;

