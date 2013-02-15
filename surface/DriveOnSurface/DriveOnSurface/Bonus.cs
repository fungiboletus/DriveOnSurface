using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{

    /**
     * Représente les bonus (pièges posés ou les bonus à ramasser)
     */
    class Bonus : IDrawableObject, IMovableObject
    {
        public enum BType { Clous, Train, Granny, Unknown, None };

        public Sprite BSprite;

        public BType BonusType;

        public String ID;

        public Bonus(String ID, BType _BonusType)
        {
            BSprite = new Sprite();

            BSprite.depth = 0.9f;

            this.ID = ID;

            this.BonusType = _BonusType;

        }

        public void Draw(SpriteBatch sb)
        {
            if (BonusType != BType.None)
            {
                BSprite.Draw(sb);
            }
        }

        public void LoadContent(ContentManager theContentManager)
        {
            switch (BonusType)
            {
                case BType.Clous:
                    BSprite.LoadContent(theContentManager, "nails");
                    BSprite.origin = new Vector2(50,50);
                    break;
                case BType.Train:
                    BSprite.LoadContent(theContentManager, "train");
                    BSprite.origin = new Vector2(160, 35);
                    break;
                case BType.Granny:
                    BSprite.LoadContent(theContentManager, "rabbit");
                    BSprite.origin = new Vector2(15, 15);
                    break;
                default:
                    BSprite.LoadContent(theContentManager, "bonusblock1");
                    BSprite.origin = new Vector2(15,15);
                    break;

            }
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
