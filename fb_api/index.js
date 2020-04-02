var express = require('express');
var router = express.Router();
const bizSdk = require('facebook-nodejs-business-sdk');
const accessToken = 'EAADPDsc0kXgBAED7QDu9Cm1TIompB3m6fGcWsBlY0o8vZC1QgG5mR1TRiyQ4ZA0Y3SmRic1CvHEbCOKFXbRZCQEdpIETp9JkRCQ8Qka8eEjqdwQ9198t4EJTyXGW05QBKCaC1gtIFkVHI8eGZAIem7Hr0qZCBfVme4KkMdnneBavVhdJDS5dMZABvHPQAjUnc6HUtz3PPSxIXPg00oeCsw';
const accountId = 'act_629391534287881';

const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const account = new AdAccount(accountId);
var campaigns;
router.get('/', async (req, res) =>{ 
account.read([AdAccount.Fields.name])
  .then((account) =>{
    return account.getCampaigns([Campaign.Fields.name], { limit: 10 })
  })
  .then((result) =>{
    campaigns = result
    campaigns.forEach((campaign) =>res.send(campaign.name+":"+campaign.id)
    
    )  
  }).catch(console.error);});
  router.post('/create',async(req,res)=>{
    console.log("create");
    account
  .createCampaign(
    [],
    { 
      [Campaign.Fields.name]: 'Shubham',
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.objective]: Campaign.Objective.page_likes
    }
  )
  .then((campaign) => {
    res.send("camp created");
  })
  .catch((error) => {
  });
  })
  router.put('/update',async(req,res)=>{
    const campaignId = req.query.id;
  new Campaign(campaignId, {
  [Campaign.Fields.id]: Campaign.id,
  [Campaign.Fields.name]: 'Campaign - Updated' })
  .update().then((Campaign) => {
    res.send("update successfull");
  }) .catch((error) => {
    console.log("error",error);
  });
  })
  router.delete('/delete',async(req,res)=>{
    console.log("Delete");
    const campaignId = req.query.id;
    new Campaign(campaignId).delete().then((Campaign) => {
    res.send("delete successfull");
  })
  })
  module.exports = router;