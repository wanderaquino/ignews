import { NextApiRequest, NextApiResponse } from "next";

export default function getUsers (request: NextApiRequest, response: NextApiResponse) {
    const users = [
        {id: 1, name: "José"},
        {id: 2, name: "Charles"},
        {id: 3, name: "Nelson"},
        {id: 4, name: "Bargos"},
    ]

    return response.json(users);
}