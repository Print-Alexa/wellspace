import { useState } from "react";
import { Send, MessageCircle, Heart, Sparkles } from "lucide-react";
import { C, serif, sans, reactionById } from "../constants";
import {
  Button,
  Card,
  Avatar,
  EmptyState,
  Aura,
  Motif,
} from "../components/ui";
import { toast } from "../lib/toast";
import * as db from "../lib/db";

export default function CommunityFeedScreen({ user }) {
  const [ownPosts, setOwnPosts] = useState(user?.posts || []);
  const [draft, setDraft] = useState("");
  const [openReplies, setOpenReplies] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [reactionState, setReactionState] = useState({}); // { postId: { iconId: bool } }

  const allPosts = ownPosts;

  const compose = () => {
    const text = draft.trim();
    if (!text) return;
    const post = db.addPost(text);
    setOwnPosts((p) => [post, ...p]);
    setDraft("");
    toast("Shared anonymously — no name attached", Heart);
  };

  const toggleReaction = (postId, iconId) => {
    setReactionState((s) => {
      const isOn = s[postId]?.[iconId];
      return {
        ...s,
        [postId]: { ...s[postId], [iconId]: !isOn },
      };
    });
  };

  const addReply = (postId) => {
    const text = (replyDrafts[postId] || "").trim();
    if (!text) return;
    // Replies to own posts persist; replies on community posts are session-only
    // (the shared replies collection lives in Firestore in production).
    if (postId.startsWith("post_") && ownPosts.some((p) => p.id === postId)) {
      db.saveUser({
        posts: ownPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                replies: [
                  ...(p.replies || []),
                  { name: user?.anonName || "you", text, mine: true },
                ],
              }
            : p,
        ),
      });
      setOwnPosts((p) =>
        p.map((post) =>
          post.id === postId
            ? {
                ...post,
                replies: [
                  ...(post.replies || []),
                  { name: user?.anonName || "you", text, mine: true },
                ],
              }
            : post,
        ),
      );
    }
    setReplyDrafts((d) => ({ ...d, [postId]: "" }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        position: "relative",
      }}
    >
      <Aura tone="sage" size={420} top="-90px" right="-110px" />
      <Aura tone="rose" size={360} bottom="-70px" left="-100px" />
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(28px, 3.6vw, 38px)",
                color: C.ink,
              }}
            >
              The common room
            </h1>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
              Anonymous voices, gentle support. No followers, no likes to chase.
            </p>
          </div>
          <span
            className="ws-pill"
            style={{ background: C.sageSoft, color: C.sage }}
          >
            <Heart size={11} strokeWidth={2} /> everyone here is anonymous
          </span>
        </div>
      </div>

      {/* Compose */}
      <Card tone="butter" style={{ padding: 18 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share a small win, a hard day, or a question — no name attached…"
          rows={3}
          className="ws-textarea"
          style={{ background: "var(--glass)" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 12,
          }}
        >
          <p style={{ fontSize: 11.5, color: C.faint }}>
            Posted as{" "}
            <strong style={{ color: C.clay, fontWeight: 600 }}>
              {user?.anonName || "you"}
            </strong>{" "}
            — a name only you can see.
          </p>
          <Button onClick={compose} disabled={!draft.trim()}>
            <Send size={14} strokeWidth={2} /> Share anonymously
          </Button>
        </div>
      </Card>

      {/* Feed */}
      {allPosts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Motif motif="butterfly" color={C.sage} size={30} />}
            title="The common room is quiet"
            desc="When students post here, their words will appear — anonymous, kind, and real. Share a thought to begin."
          >
            <Button
              variant="soft"
              onClick={() => document.querySelector(".ws-textarea")?.focus()}
            >
              <Sparkles size={15} strokeWidth={1.8} /> Be the first to share
            </Button>
          </EmptyState>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {allPosts.map((post) => {
            const replies = post.replies || [];
            const showReplies = !!openReplies[post.id];
            return (
              <Card
                key={post.id}
                style={{ padding: 20, transition: "transform 0.18s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <Avatar
                    seed={post.name?.length * 7 || 4}
                    size={36}
                    style={{ fontSize: 16 }}
                  >
                    {post.name?.[0]?.toUpperCase() || "A"}
                  </Avatar>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.clay }}>
                      {post.name}
                      {post.mine && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: C.sage,
                            marginLeft: 7,
                            background: C.sageSoft,
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          you
                        </span>
                      )}
                    </p>
                    <p style={{ fontSize: 10.5, color: C.faint }}>
                      {post.time}
                    </p>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      color: C.faint,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    shared anonymously
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: C.ink,
                    marginBottom: 14,
                  }}
                >
                  {post.text}
                </p>

                {/* reactions */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {(post.reactions || []).map((r) => {
                    const react = reactionById(r.icon || r.emoji);
                    const RIcon = react.icon;
                    const mine = reactionState[post.id]?.[react.id] ?? r.mine;
                    return (
                      <button
                        key={react.id}
                        onClick={() => toggleReaction(post.id, react.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 12px",
                          borderRadius: 999,
                          border: `1.5px solid ${mine ? C.clay : "var(--card-line)"}`,
                          background: mine ? C.claySoft : "var(--glass)",
                          color: mine ? C.clay : C.muted,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: sans,
                          transition: "all 0.16s",
                        }}
                      >
                        <RIcon size={12} strokeWidth={1.8} />{" "}
                        {r.count + (mine && !r.mine ? 1 : 0)}
                      </button>
                    );
                  })}
                </div>

                {/* replies */}
                <button
                  onClick={() =>
                    setOpenReplies((o) => ({ ...o, [post.id]: !o[post.id] }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "none",
                    background: "none",
                    color: C.faint,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: sans,
                    padding: 0,
                  }}
                >
                  <MessageCircle size={13} strokeWidth={1.8} />
                  {replies.length > 0
                    ? `${replies.length} repl${replies.length === 1 ? "y" : "ies"}`
                    : "Reply"}
                  <span style={{ fontSize: 9 }}>▾</span>
                </button>

                {showReplies && (
                  <div
                    className="ws-rise"
                    style={{
                      marginTop: 12,
                      borderTop: "1px dashed rgba(44,35,48,0.14)",
                      paddingTop: 12,
                    }}
                  >
                    {replies.length === 0 && (
                      <p
                        style={{
                          fontSize: 12.5,
                          color: C.faint,
                          marginBottom: 10,
                        }}
                      >
                        No replies yet — be the first gentle voice.
                      </p>
                    )}
                    {replies.map((r, i) => (
                      <div
                        key={i}
                        style={{ display: "flex", gap: 9, marginBottom: 10 }}
                      >
                        <Avatar
                          seed={(r.name?.length || 2) * 3}
                          size={26}
                          style={{ fontSize: 12 }}
                        >
                          {r.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <div
                          style={{
                            background: "var(--glass)",
                            border: "1px solid var(--card-line)",
                            borderRadius: "4px 14px 14px 14px",
                            padding: "9px 13px",
                            flex: 1,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: C.sage,
                              marginBottom: 2,
                            }}
                          >
                            {r.name}
                            {r.mine && (
                              <span style={{ color: C.faint, fontWeight: 500 }}>
                                {" "}
                                · you
                              </span>
                            )}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              color: C.ink,
                              lineHeight: 1.55,
                            }}
                          >
                            {r.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <input
                        value={replyDrafts[post.id] || ""}
                        onChange={(e) =>
                          setReplyDrafts((d) => ({
                            ...d,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && addReply(post.id)
                        }
                        placeholder="Reply gently…"
                        className="ws-input"
                        style={{
                          borderRadius: 999,
                          padding: "9px 14px",
                          fontSize: 13,
                        }}
                      />
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => addReply(post.id)}
                        disabled={!(replyDrafts[post.id] || "").trim()}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {allPosts.length > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: C.faint,
            padding: "4px 0 10px",
            fontStyle: "italic",
            fontFamily: serif,
          }}
        >
          What's shared here stays here — anonymous, always.
        </p>
      )}
    </div>
  );
}
