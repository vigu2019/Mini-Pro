const db = require('../utils/db');

const getPackageDetails = async (req, res) => {
    try{
        const allPackages = await db.query('SELECT * FROM travel_packages');
        res.status(200).json(allPackages.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({msg: 'Server error'});
    }
}

const getEachPackageWithAgency = async (req, res) => {
    try{
        const package_id = req.params.id;
        const packageDetails = await db.query('SELECT * FROM travel_packages NATURAL JOIN travel_agencies WHERE package_id = $1', [package_id]);
        // console.log(packageDetails.rows);
        res.status(200).json(packageDetails.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({msg: 'Server error'});
    }
}

module.exports = {
    getPackageDetails,
    getEachPackageWithAgency
};