
const State = require("../model/State");
const stateJson = require("../model/states.json");

//Get all States
const getStates = async (req, res) => {
    const states = await stateJson;
    var keys = ["code"];
    var values = ["HI", "AK"];
    if (!states)
        return res.status(400).json({ message: "No states found." });
    if (req.query.contig === 'false') {
        let result = states.filter(function (e) {
            return keys.every(function (a) {
                return values.includes(e[a])
            })
        })
        res.json(result); } else if (req.query.contig === 'true') {
        let result = states.filter(function (e) {
            return keys.every(function (a) {
                return !values.includes(e[a])
            })
        })
        res.json(result);
    } else {
        res.json(states);
    }
};


//Create a funfact
const createNewFunFact = async (req, res) => {
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length != 2) {
        return res.status(400).json({ message: "State Abbreviation is required and must be 2 characters." });
    }
    if (!req?.body?.funfacts) {
        return res.status(400).json({ message: "funfacts value is required" });
    }
    if (!Array.isArray(req?.body?.funfacts)) {
        return res.status(400).json({ message: "funfacts value must be an array" });
    }
    try {
        await State.updateOne({
            stateCode: input
        },
            {
                $addToSet: {
                    funfacts: { $each: req.body.funfacts}},
            }, { upsert: true });
    const mongoResult = await State.findOne({ stateCode: input }).exec();
        res.status(201).json(mongoResult);
  } catch (error) {
    console.log(error);
  }
};

//Get a funfact
const getFunFact = async (req, res) => {
    const result = await getData(req, res);
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({ message: "State Abbreviation is required and must be 2 characters." });
    }
    if (!result[0].funfacts) {
        return res.status(400).json({ message: `No Fun Fact found for ${input}` });
    }
        const randomFact = result[0].funfacts[Math.floor(Math.random() * result[0].funfacts.length)];
        let funFactRes = {
            "funfact": randomFact
        }
        res.json(funFactRes);

};

//update a funfact
const updateFunFact = async (req, res) => {
    if (req?.body?.index <1 || !req?.body.index || !req.body.funfact) {
        return res.status(400).json({ message: "index and funfact parameters are required and index should be greater than 0. " });
    }
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({ message: "State Abbreviation is required and must be 2 characters." });
    }
    const index = req?.body?.index-1;
    const mongoResult = await State.findOne({ stateCode: input }).exec();
    if (index > mongoResult.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${input}` });
    } else {
        try {
            mongoResult.funfacts[index] = req.body.funfact;
            await State.updateOne({
                stateCode: input
            },
                {
                    $set: { funfacts: mongoResult.funfacts },
                });
            res.status(201).json(mongoResult);
        } catch (error) {
            console.log(error);
        }
    }
};

//Delete funfact
const deleteFunFact = async (req, res) => {
    if (req?.body?.index < 1 || !req?.body.index) {
        return res.status(400).json({ message: "Index parameter is required and should be greater than 0. " });
    }
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({ message: "State Abbreviation is required and must be 2 characters." });
    }

    const index = req?.body?.index - 1;
    const mongoResult = await State.findOne({ stateCode: input }).exec();

    if (index >= mongoResult.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${input}` });
    } else {
        try {
            mongoResult.funfacts.splice(index, 1);
            await State.updateOne({
                stateCode: input
            },
                {
                    $set: { funfacts: mongoResult.funfacts },
                });
            res.status(201).json(mongoResult);
        } catch (error) {
            console.log(error);
        }
    }
};

//Get State
const getState = async (req, res) => {
    try {
        const result = await getData(req, res);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
};

//Get State Capital
const getStateCapital = async (req, res) => {
    const result = await getData(req, res);
    let capitalRes = {
        "state": result[0].state,
        "capital": result[0].capital_city
    }
    res.json(capitalRes);
};

//Get State Nickname
const getStateNickname = async (req, res) => {
    const result = await getData(req, res);
    let nicknameRes = {
        "state": result[0].state,
        "nickname": result[0].nickname
    }
    res.json(nicknameRes);
};

//Get State Population
const getStatePopulation = async (req, res) => {
    const result = await getData(req, res);
    let populationRes = {
        "state": result[0].state,
        "population": result[0].population.toLocaleString("en-US")
    }
    res.json(populationRes);
};

//Get State Admission
const getStateAdmission = async (req, res) => {
    const result = await getData(req, res);
    let admissionRes = {
        "state": result[0].state,
        "admitted": result[0].admission_date
    }
    res.json(admissionRes);
};


//Function to get state data
const getData = async (req, res) => {
    const states = await stateJson;
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({ message: "State Abbreviation is required and must be 2 characters." });
    }

    var keys = ["code"];
    var result = states.filter(function (e) {
        return keys.every(function (a) {
            return input.includes(e[a])
        })
    })

    if (!result || result.length === 0) {
        return res
            .status(400)
            .json({ message: "No State matches State Abbreviation" });

    }
    const mongoResult = await State.findOne({ stateCode: input }).exec();
    if (mongoResult !== null) {
        let funFactRes =
            mongoResult.funfacts;

        result[0].funfacts = funFactRes;
        return result;
    } else
        return result;
}

module.exports = {
    getStates,
    updateFunFact,
    deleteFunFact,
    createNewFunFact,
    getFunFact,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
};
 