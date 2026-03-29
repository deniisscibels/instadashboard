import {
  doc, setDoc, getDoc, collection, getDocs, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Save user profile + stats
export async function saveUserData(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Load user's own data
export async function loadUserData(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// Save a stats snapshot for leaderboard tracking
export async function saveStatsSnapshot(uid, profile) {
  const today = new Date().toISOString().split("T")[0];
  await setDoc(doc(db, "users", uid, "snapshots", today), {
    followers: Number(profile.followers) || 0,
    totalViews: Number(profile.totalViews) || 0,
    totalLikes: Number(profile.totalLikes) || 0,
    reelsCount: Number(profile.reelsCount) || 0,
    date: today,
  });
}

// Get leaderboard — all users with their latest data
export async function getLeaderboard() {
  const usersSnap = await getDocs(collection(db, "users"));
  const users = [];

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data();
    if (!data.displayName) continue;

    // Get latest 2 snapshots for growth calculation
    const snapshotsRef = collection(db, "users", userDoc.id, "snapshots");
    const snapshotsSnap = await getDocs(query(snapshotsRef, orderBy("date", "desc")));
    const snapshots = snapshotsSnap.docs.map((d) => d.data());

    const latest = snapshots[0] || {};
    const previous = snapshots[1] || snapshots[0] || {};

    users.push({
      uid: userDoc.id,
      displayName: data.displayName,
      photoURL: data.photoURL || "",
      instagramHandle: data.instagramHandle || "",
      followers: latest.followers || 0,
      totalViews: latest.totalViews || 0,
      totalLikes: latest.totalLikes || 0,
      reelsCount: latest.reelsCount || 0,
      followerGrowth: (latest.followers || 0) - (previous.followers || 0),
      viewsGrowth: (latest.totalViews || 0) - (previous.totalViews || 0),
    });
  }

  return users;
}
