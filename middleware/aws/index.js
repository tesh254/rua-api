import axios from "axios";

export function getEmailJSONFromS3(req, res, next) {
    const { hosted_url } = req.body;

    axios.get(hosted_url)
        .then(response => {
            res.status(200).json(response.data);
        }).catch(err => {
            res.status(500).json({
                message: "Error getting email from storage",
            });
        })
}