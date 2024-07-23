import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/admin";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if(method === 'GET') {
        if(req.query?.id ){
            res.json(await Admin.findOne({_id:req.query.id}));
        } else {
            res.json(await Admin.find());
        }
    }

    if (method === 'POST') {
        const {name,email} = req.body;
        const AdminDoc = await Admin.create({
            name,email
        })
        res.json(AdminDoc);
    }

    if (method === 'PUT') {
        const {name,email} = req.body;
        await Admin.updateOne({_id}, {name,email});
        res.json(true);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 2) {
            return res.status(400).json({ error: 'No se puede eliminar el administrador. Debe haber al menos dos administradores.' });
        }
        await Admin.deleteOne({_id});
        res.json('ok');
    }
}