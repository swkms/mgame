import { Database } from "sqlite3";
import { Game } from "../models/game";
const remote = require('@electron/remote')
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

export class DB {
    db!: Database

    openDB() {
        return new Promise((resolve, reject) => {

            const rootPath = remote.app.getPath("userData")
            const fileName = path.join(rootPath, "mgame.db")

            try {
                //fs.unlinkSync(fileName);
                console.log('File deleted successfully');
            } catch (err) {
                console.error('Error deleting file:', err);
            }

            this.db = new sqlite3.Database(fileName, (err) => {
                if (err) {
                    console.error("创建数据库失败", err.message);
                    reject(err);
                } else {
                    console.log('Connected to the SQLite database.');
                    this.db.serialize(() => {
                        this.db.run(`CREATE TABLE IF NOT EXISTS Games (
                            GameID INTEGER PRIMARY KEY AUTOINCREMENT,
                            Name VARCHAR(255),
                            CreateTime INTEGER,
                            Cover VARCHAR(255),
                            GameSort INT DEFAULT 0,
                            APP VARCHAR(255)
                        );`, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(null);
                            }
                        });
                    });
                }
            });
        });
    }

    closeDB() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Closed the SQLite database connection.');
            }
        });
    }

    getGames(name: string): Promise<Array<Game>> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM Games`
            let params = new Array<string>()
            if (name != "") {
                sql += " where Name Like ?"
                params.push('%'+name+'%')
            }
            this.db.all(sql, params, (err, rows: Array<Game>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    createGame(game: Game) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Games (Name,CreateTime,Cover,GameSort,APP) VALUES (?,?,?,?,?)`
            const params = [game.Name, new Date().getTimestamp(), game.Cover, game.GameSort, game.APP]
            this.db.run(sql, params, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })
        });
    }

    removeGame(gameID: number) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM Games where GameID=?`
            const params = [gameID]
            this.db.run(sql, params, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })
        });
    }
}

export default new DB()

