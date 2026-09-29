import axios from "axios";

export const URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
export const VERSION_URL = "https://db.ygoprodeck.com/api/v7/checkDBVer.php";

/**
 * Queries the YGOPRODeck card API and returns the matching cards.
 * @param {Object} params query parameters, e.g. { id: 46986414 }
 */
export const callApi = async (params) => {
    if (Object.keys(params).length === 0) return null;

    const { data: response } = await axios.get(URL, { params });

    return response?.data;
};

/** Returns the card database version, which changes whenever cards are added or edited. */
export const getDbVersion = async () => {
    const { data } = await axios.get(VERSION_URL);
    return data?.[0]?.database_version;
};
