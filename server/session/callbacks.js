import fs from "fs";

/*
  NOTE: This module holds the implementation of CustomSessionStorage for the Shopify instance in `server.js`
  This is only a temporary solution for development purposes. This implementation might change in the future.
*/

// Local json filename to store currently authenticated shops
const fileName = "./sessions.json";

export async function storeCallback(session) {
  const fileExists = await fs.promises
    .access(fileName)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    const content = await fs.promises.readFile(fileName, {
      encoding: "utf-8",
    });
    const sessions = JSON.parse(content);
    sessions.push(session);
    await fs.promises.writeFile(fileName, JSON.stringify(sessions, null, 2), {
      encoding: "utf-8",
    });
  } else {
    await fs.promises.writeFile(fileName, JSON.stringify([session], null, 2), {
      encoding: "utf-8",
    });
  }

  return true;
}

export async function loadCallback(id) {
  const fileExists = await fs.promises
    .access(fileName)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    const content = await fs.promises.readFile(fileName, {
      encoding: "utf-8",
    });
    const sessions = JSON.parse(content);
    const session = sessions.find((each) => each.id === id);
    return session;
  }
}

export async function deleteCallback(id) {
  const fileExists = await fs.promises
    .access(fileName)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    const content = await fs.promises.readFile(fileName, {
      encoding: "utf-8",
    });
    const sessions = JSON.parse(content);
    const newSessions = sessions.filter((each) => each.id !== id);
    await fs.promises.writeFile(fileName, JSON.stringify(newSessions, null, 2), {
      encoding: "utf-8",
    });
  }

  return true;
}

export async function loadAllSessions() {
  try {
    const fileExists = await fs.promises
      .access(fileName)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const content = await fs.promises.readFile(fileName, {
        encoding: "utf-8",
      });
      return JSON.parse(content);
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function loadSessionByShop(shop) {
  try {
    const fileExists = await fs.promises
      .access(fileName)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const content = await fs.promises.readFile(fileName, {
        encoding: "utf-8",
      });
      const sessions = JSON.parse(content);
      const session = sessions.find((each) => each.shop === shop);
      return session;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSessionByShop(shop) {
  try {
    const fileExists = await fs.promises
      .access(fileName)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const content = await fs.promises.readFile(fileName, {
        encoding: "utf-8",
      });
      const sessions = JSON.parse(content);
      const newSessions = sessions.filter((each) => each.shop !== shop);
      await fs.promises.writeFile(fileName, JSON.stringify(newSessions, null, 2), {
        encoding: "utf-8",
      });
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}
