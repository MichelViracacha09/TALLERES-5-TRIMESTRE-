const model = require('../models/productModel');
async function getAll(req, res, next) { try { res.json(await model.getAll()); } catch (error) { next(error); } }
async function getById(req, res, next) { try { const item = await model.getById(req.params.id); item ? res.json(item) : res.status(404).json({ error: 'Producto no encontrado' }); } catch (error) { next(error); } }
async function create(req, res, next) { try { res.status(201).json(await model.create(req.body)); } catch (error) { next(error); } }
async function update(req, res, next) { try { const item = await model.update(req.params.id, req.body); item ? res.json(item) : res.status(404).json({ error: 'Producto no encontrado' }); } catch (error) { next(error); } }
async function remove(req, res, next) { try { const removed = await model.remove(req.params.id); removed ? res.status(204).end() : res.status(404).json({ error: 'Producto no encontrado' }); } catch (error) { next(error); } }
module.exports = { getAll, getById, create, update, remove };
