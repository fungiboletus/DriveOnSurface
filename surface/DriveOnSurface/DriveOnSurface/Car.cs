using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{
    class Car : IDrawableObject, IMovableObject
    {
        public enum CColor { Red, Green, Blue, Yellow, None};

        public Sprite CarSprite;

        public CColor CarColor;

        public String ID;

        public Car(String ID, CColor color)
        {
            CarSprite = new Sprite();

            CarSprite.depth = 0.80f;

            CarColor = color;

            this.ID = ID;
        }


        public void Draw(SpriteBatch sb)
        {
            CarSprite.Draw(sb);
        }

        public Vector2 getPosition()
        {
            return CarSprite.Position;
        }

        public void setPosition(Vector2 Pos)
        {
            CarSprite.Position = Pos;
        }

        public void setPosition(int X, int Y)
        {
            CarSprite.Position.X = X;
            CarSprite.Position.Y = Y;
        }

        public float getRotation()
        {
            return CarSprite.rotation;
        }

        public void setRotation(float Rot)
        {
            CarSprite.rotation = Rot;
        }


        public void LoadContent(Microsoft.Xna.Framework.Content.ContentManager theContentManager)
        {
            switch (CarColor)
            {
                case CColor.Red :
                    CarSprite.LoadContent(theContentManager, "red-car");
                    break;
                case CColor.Green :
                    CarSprite.LoadContent(theContentManager, "green-car");
                    break;
                case CColor.Blue :
                    CarSprite.LoadContent(theContentManager, "blue-car");
                    break;
                case CColor.Yellow :
                    CarSprite.LoadContent(theContentManager, "yellow-car");
                    break;
            }
        }


        public string getID()
        {
            return ID;
        }
    }
}
