const pool = require("../config/db")

const getAllPartners = async (req,res)=>{
    const allPartnersQuery = await pool.query("select * from partner")
    const allPartners = allPartnersQuery.rows
    res.json({
        message : "All Partners",
        allPartners : allPartners
    })
}

const requestPartner = async (req,res) => {
    
}



module.exports = {getAllPartners,requestPartner}