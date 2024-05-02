import { City, Country, State } from 'country-state-city'


const useLocation = () => {
    const getCountryByCode = (countryCode: string) => {
        return Country.getAllCountries().find((country) => country.isoCode === countryCode);
    };

    const getStateCode = (countryCode: string, stateCode: string) => {
        const state = State.getAllStates().find((state) => state.countryCode === countryCode && stateCode === stateCode);

        if(!state) return null;

        return state;
    };

    const getCountryStates = (countryCode: string) => {
        return State.getAllStates().filter((state) => state.countryCode === countryCode);
    };

    const getStateCities = (countryCode: string, stateCode?: string) => {
        return City.getAllCities().filter((city: any) => city.countryCode = countryCode && city.stateCode === stateCode);
    };

    return {
        getAllCountries: Country.getAllCountries,
        getCountryByCode,
        getStateCode,
        getCountryStates,
        getStateCities,
    }
}

export default useLocation;