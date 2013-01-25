using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{
    class Bonus : IDrawableObject, IMovableObject
    {
        public enum BType { Clous, Train, Granny, Glue, Unknown };

        public Sprite BSprite;

        public BType BonusType;

        public String ID;

        public Bonus(String ID, BType _BonusType)
        {
            BSprite = new Sprite();

            BSprite.depth = 0.4f;

            this.ID = ID;

            this.BonusType = _BonusType;

        }

        public void Draw(SpriteBatch sb)
        {
            BSprite.Draw(sb);
        }

        public void LoadContent(ContentManager theContentManager)
        {
            //BSprite.LoadContent(theContentManager, "");
        }

        public Vector2 getPosition()
        {
            return BSprite.Position;
        }

        public void setPosition(Vector2 Pos)
        {
            BSprite.Position = Pos;
        }

        public void setPosition(int X, int Y)
        {
            BSprite.Position.X = X;
            BSprite.Position.Y = Y;
        }

        public float getRotation()
        {
            return BSprite.rotation;
        }

        public void setRotation(float Rot)
        {
            BSprite.rotation = Rot;
        }


        public string getID()
        {
            return ID;
        }
    }
}
