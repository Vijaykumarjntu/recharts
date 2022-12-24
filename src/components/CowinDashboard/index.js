// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

class CowinDashboard extends Component {
  state = {
    isLoading: true,
    coverage: [],
    age: [],
    gender: [],
    showContent: false,
    showError: false,
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const res = await fetch(vaccinationDataApiUrl)
    if (res.ok) {
      const data = await res.json()
      const mappedData = data.last_7_days_vaccination.map(x => ({
        vaccineDate: x.vaccine_date,
        dose1: x.dose_1,
        dose2: x.dose_2,
      }))
      const mappedAge = data.vaccination_by_age
      const mappedGender = data.vaccination_by_gender
      this.setState({
        coverage: mappedData,
        age: mappedAge,
        gender: mappedGender,
        isLoading: false,
        showContent: true,
      })
    } else {
      this.setState({isLoading: false, showError: true})
    }
  }

  renderLoading = () => (
    <div className="loader" testid="loader">
      <Loader type="TailSpin" color="#ff12dd" height={50} width={50} />
    </div>
  )

  renderErrorPage = () => (
    <div className="errorContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  render() {
    const {
      coverage,
      age,
      gender,
      showError,
      showContent,
      isLoading,
    } = this.state
    console.log(coverage)
    console.log(age)
    console.log(gender)
    return (
      <>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1>CoWIN Vaccination in India</h1>
        {isLoading && this.renderLoading()}
        {showError && this.renderErrorPage()}
        {showContent && (
          <>
            <VaccinationCoverage coverage={coverage} />
            <VaccinationByGender gender={gender} />
            <VaccinationByAge age={age} />
          </>
        )}
      </>
    )
  }
}
export default CowinDashboard
